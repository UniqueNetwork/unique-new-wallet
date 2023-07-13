import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FieldError, FormProvider, useForm, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import classNames from 'classnames';
import { useDebounce } from 'use-debounce';
import { collection } from '@unique-nft/utils/address';
import {
  CollectionAttributesSchema,
  SchemaTools,
  UniqueCollectionSchemaToCreate,
} from '@unique-nft/schemas';

import {
  DeviceSize,
  useAccounts,
  useApi,
  useBalanceInsufficient,
  useDeviceSize,
} from '@app/hooks';
import {
  useCollectionCreate,
  useCollectionSetProperties,
  useCollectionSetTokenPropertyPermissions,
  useExtrinsicCacheEntities,
} from '@app/api';
import { MY_TOKENS_TABS_ROUTE, ROUTE } from '@app/routes';
import {
  Alert,
  Button,
  CollectionSidebar,
  CollectionStepper,
  Confirm,
  ConfirmBtn,
  StatusTransactionModal,
  Typography,
  useNotifications,
} from '@app/components';
import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { BottomBar } from '@app/pages/components/BottomBar';
import { MetamaskAccountName } from '@app/account/MetamaskWallet';

import { FORM_ERRORS } from '../constants';
import { CollectionForm, Warning } from './types';
import { ButtonGroup, FormWrapper } from '../components/FormComponents';
import { tabsUrls, warnings } from './constants';
import { useCollectionFormMapper } from './useCollectionFormMapper';
import { StatusCreateTransactionsModal } from './components/StatusCreateTransactionsModal/StatusCreateTransactionsModal';

interface CreateCollectionProps {
  className?: string;
}

const WrapperContentStyled = styled(WrapperContent)`
  margin-bottom: calc(var(--prop-gap) * 2.5);

  @media screen and (min-width: 1025px) {
    margin-bottom: 0;
  }
`;

const ButtonsGroup = styled.div`
  position: absolute;
  bottom: 0;
  padding: calc(var(--prop-gap) / 1.6) calc(var(--prop-gap) / 2);
`;

const CreateCollectionComponent = ({ className }: CreateCollectionProps) => {
  const deviceSize = useDeviceSize();
  const [currentStep, setCurrentStep] = useState(1);
  const [warning, setWarning] = useState<Warning | null>();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { currentChain } = useApi();
  const { error, info } = useNotifications();
  const {
    selectedAccount,
    isLoading,
    accounts: { size: accountsLength },
  } = useAccounts();
  const formMapper = useCollectionFormMapper();
  const {
    getFee,
    fee,
    feeFormatted,
    feeLoading,
    submitWaitResult,
    isLoadingSubmitResult,
    feeError,
    submitWaitResultError,
  } = useCollectionCreate();

  const setTokenPropertyPermissions = useCollectionSetTokenPropertyPermissions();
  const setProperties = useCollectionSetProperties();

  const { setPayloadEntity } = useExtrinsicCacheEntities();

  const { isBalanceInsufficient } = useBalanceInsufficient(
    selectedAccount?.address,
    fee || '0',
  );

  const collectionForm = useForm<CollectionForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      symbol: '',
      description: '',
      address: selectedAccount?.address,
      nesting: {
        tokenOwner: true,
        collectionAdmin: true,
      },
    },
  });
  const {
    control,
    formState: { isValid, errors },
    handleSubmit,
  } = collectionForm;
  const collectionFormValues = useWatch<CollectionForm>({
    control,
  });

  const [collectionDebounceValue] = useDebounce(collectionFormValues as any, 500);

  const returnToCreateToken = useMemo(() => {
    return (
      (location.state as { returnToCreateToken: boolean })?.returnToCreateToken || false
    );
  }, [location.state]);

  useEffect(() => {
    navigate(tabsUrls[currentStep - 1], { state: { returnToCreateToken } });
  }, [currentStep, returnToCreateToken]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    selectedAccount && collectionForm.setValue('address', selectedAccount?.address);
  }, [selectedAccount, isLoading, accountsLength]);

  useEffect(() => {
    if (!feeError) {
      return;
    }
    error(feeError);
  }, [feeError]);

  useEffect(() => {
    if (
      !submitWaitResultError &&
      !setTokenPropertyPermissions.submitWaitResultError &&
      !setProperties.submitWaitResultError
    ) {
      return;
    }
    setIsCreating(false);
    error(
      submitWaitResultError ||
        setTokenPropertyPermissions.submitWaitResultError ||
        setProperties.submitWaitResultError,
    );
  }, [
    submitWaitResultError,
    setTokenPropertyPermissions.submitWaitResultError,
    setProperties.submitWaitResultError,
  ]);

  useEffect(() => {
    if (collectionDebounceValue && isValid) {
      const collection = formMapper(collectionDebounceValue);
      getFee(collection);
    }
  }, [collectionDebounceValue, getFee]);

  const goToNextStep = (step: number) => setCurrentStep(step);
  const goToPreviousStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };
  const onNextStep = ({ coverPictureIpfsCid }: CollectionForm) => {
    if (!coverPictureIpfsCid) {
      setWarning(warnings.coverIsNotDefine);

      return;
    }

    goToNextStep(currentStep + 1);
  };

  const onCreateCollectionHandle = (form: CollectionForm) => {
    if (!form.attributes?.length) {
      setWarning(warnings.attributesAreNotDefine);

      return;
    }

    onSubmit(form);
  };

  const onSubmit = async (form: CollectionForm) => {
    if (!selectedAccount) {
      error('Account is not found');

      return;
    }

    const payload = formMapper(form);
    setCurrentStage(0);
    setIsCreating(true);
    const createdCollection = await submitWaitResult({ payload });
    const collectionId = createdCollection?.parsed?.collectionId;

    if (selectedAccount.name === MetamaskAccountName) {
      if (!collectionId) {
        setIsCreating(false);
        error('Something went wrong');
        return;
      }
      setCurrentStage(1);
      const { schema } = payload;
      const { coverPicture, attributesSchema } = schema || {};
      const schemaToCreate = {
        ...schema,
        coverPicture: { ipfsCid: (coverPicture as { ipfsCid: string })?.ipfsCid || '' },
        attributesSchema: attributesSchema as CollectionAttributesSchema,
      } as UniqueCollectionSchemaToCreate;

      const properties =
        SchemaTools.tools.unique.collection.encodeCollectionSchemaToProperties(
          schemaToCreate,
        );

      const propertyPermissions =
        SchemaTools.tools.unique.collection.generateTokenPropertyPermissionsFromCollectionSchema(
          schemaToCreate,
        );
      await setTokenPropertyPermissions.submitWaitResult({
        senderAddress: selectedAccount.address,
        payload: {
          address: selectedAccount.address,
          collectionId,
          propertyPermissions,
        },
      });
      setCurrentStage(2);
      await setProperties.submitWaitResult({
        senderAddress: selectedAccount.address,
        payload: {
          address: selectedAccount.address,
          collectionId,
          properties,
        },
      });
    }

    setIsCreating(false);
    info('Collection created successfully');

    setPayloadEntity({
      type: 'create-collection',
      parsed: createdCollection?.parsed,
      entityData: payload,
    });

    if (returnToCreateToken) {
      navigate(`/${currentChain?.network}/${ROUTE.CREATE_NFT}`, {
        state: {
          collection_id: collectionId,
          name: payload.name,
          description: payload.description,
          // @ts-ignore
          collection_cover: payload.schema?.coverPicture.ipfsCid,
        },
      });
      return;
    }
    navigate(`/${currentChain?.network}/${ROUTE.MY_COLLECTIONS}`);
  };

  const isFirstStep = currentStep - 1 === 0;
  const isLastStep = currentStep === tabsUrls.length;

  const isolatedCollectionForm = useMemo(
    () => (
      <FormProvider {...collectionForm}>
        <Outlet />
      </FormProvider>
    ),
    [collectionForm],
  );

  const errorTooltip = useMemo(() => {
    if (!isValid) {
      if (!errors || !Object.values(errors).length) {
        return FORM_ERRORS.REQUIRED_FIELDS;
      }
      const { attributes, ...fieldErrors } = errors;

      if (attributes?.filter?.((item) => !!item).length) {
        return FORM_ERRORS.REQUIRED_FIELDS;
      }

      return Object.values(fieldErrors)
        .reduce<FieldError[]>((arr, item) => {
          if (item && !arr.find(({ type }) => type === item.type)) {
            arr.push(item as FieldError);
          }
          return arr;
        }, [])
        .map(({ message }) => message)
        .join('\n');
    }
    if (isBalanceInsufficient) {
      return (
        FORM_ERRORS.INSUFFICIENT_BALANCE + selectedAccount?.balance?.availableBalance.unit
      );
    }
    return null;
  }, [
    isBalanceInsufficient,
    isValid,
    errors,
    errors.attributes,
    collectionDebounceValue,
  ]);

  const isValidFirstStep = useMemo(() => {
    return !errors.name || !errors.symbol || !errors.coverPictureIpfsCid;
  }, [errors, isBalanceInsufficient]);

  const creatingStages = useMemo(() => {
    if (selectedAccount?.name === MetamaskAccountName) {
      return ['Creating collection', 'Setting permissions', 'Setting properties'];
    }
    return ['Creating collection'];
  }, [selectedAccount?.name]);

  return (
    <MainWrapper className={classNames('create-collection-page', className)}>
      <WrapperContentStyled>
        <FormWrapper>
          <CollectionStepper activeStep={currentStep} onClickStep={goToPreviousStep} />
          {isolatedCollectionForm}
          {isBalanceInsufficient || (!isBalanceInsufficient && isValid) ? (
            <FeeInformationTransaction fee={feeFormatted} feeLoading={feeLoading} />
          ) : (
            <Alert type="warning">
              A fee will be calculated after corrected filling required fields
            </Alert>
          )}
          <ButtonGroup $fill>
            {!isLastStep && (
              <ConfirmBtn
                iconRight={{
                  color: 'currentColor',
                  name: 'arrow-right',
                  size: 12,
                }}
                title="Next step"
                disabled={!isValidFirstStep}
                tooltip={errorTooltip}
                onClick={handleSubmit(onNextStep)}
              />
            )}
            {!isFirstStep && (
              <Button
                iconLeft={{
                  color: 'var(--color-primary-400)',
                  name: 'arrow-left',
                  size: 12,
                }}
                title="Previous step"
                onClick={() => goToPreviousStep(currentStep - 1)}
              />
            )}
            {isLastStep && (
              <ConfirmBtn
                role="primary"
                title="Create collection"
                tooltip={errorTooltip}
                disabled={!isValid || feeLoading || isBalanceInsufficient}
                onClick={handleSubmit(onCreateCollectionHandle)}
              />
            )}
          </ButtonGroup>
          <Confirm
            buttons={[
              { title: 'No, return', onClick: () => setWarning(null) },
              {
                title: 'Yes, I am sure',
                role: 'primary',
                type: 'submit',
                onClick: handleSubmit((form: CollectionForm) => {
                  if (isLastStep) {
                    onSubmit(form);
                  } else {
                    goToNextStep(2);
                  }

                  setWarning(null);
                }),
              },
            ]}
            isVisible={!!warning}
            title={warning?.title}
            onClose={() => setWarning(null)}
          >
            <Typography>{warning?.description}</Typography>
          </Confirm>
          <StatusCreateTransactionsModal
            isVisible={isCreating}
            descriptions={creatingStages}
            warning="Advanced settings will be available on the collection page after creating the collection"
            step={currentStage}
          />
        </FormWrapper>
      </WrapperContentStyled>
      {deviceSize >= DeviceSize.lg ? (
        <CollectionSidebar collectionForm={collectionFormValues as CollectionForm} />
      ) : (
        <BottomBar
          buttons={[
            <Button
              title="Preview"
              key="toggleDrawer"
              onClick={() => setDrawerOpen(true)}
            />,
          ]}
          isOpen={isDrawerOpen}
          parent={document.body}
        >
          <CollectionSidebar collectionForm={collectionFormValues as CollectionForm} />
          <ButtonsGroup>
            <Button
              title="Back"
              key="toggleDrawer"
              onClick={() => setDrawerOpen(false)}
            />
          </ButtonsGroup>
        </BottomBar>
      )}
    </MainWrapper>
  );
};

export const CreateCollection = withPageTitle({
  header: 'Create a collection',
  backLink: ROUTE.MY_COLLECTIONS,
})(CreateCollectionComponent);
