import { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FieldError, FormProvider, useForm, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import classNames from 'classnames';
import { useDebounce } from 'use-debounce';
import { useNotifications } from '@unique-nft/ui-kit';

import {
  DeviceSize,
  useAccounts,
  useApi,
  useBalanceInsufficient,
  useDeviceSize,
} from '@app/hooks';
import { useCollectionCreate, useExtrinsicCacheEntities } from '@app/api';
import { ROUTE } from '@app/routes';
import {
  Alert,
  Button,
  CollectionSidebar,
  CollectionStepper,
  Confirm,
  ConfirmBtn,
  StatusTransactionModal,
  Typography,
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

  const navigate = useNavigate();
  const { currentChain } = useApi();
  const { error, info } = useNotifications();
  const { selectedAccount } = useAccounts();
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

  const { setPayloadEntity } = useExtrinsicCacheEntities();

  const { isBalanceInsufficient } = useBalanceInsufficient(selectedAccount?.address, fee);

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
      },
      ownerCanDestroy: false,
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

  useEffect(() => {
    if (!selectedAccount || selectedAccount.name === MetamaskAccountName) {
      navigate('/');
      return;
    }
    collectionForm.setValue('address', selectedAccount.address);
  }, [selectedAccount]);

  useEffect(() => {
    if (!feeError) {
      return;
    }
    error(feeError);
  }, [feeError]);

  useEffect(() => {
    if (!submitWaitResultError) {
      return;
    }
    error(submitWaitResultError);
  }, [submitWaitResultError]);

  useEffect(() => {
    navigate(tabsUrls[currentStep - 1]);
  }, [currentStep, navigate]);

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

  const onSubmit = (form: CollectionForm) => {
    if (!selectedAccount) {
      error('Account is not found');

      return;
    }

    const payload = formMapper(form);

    submitWaitResult({ payload }).then((res) => {
      info('Collection created successfully');

      setPayloadEntity({
        type: 'create-collection',
        parsed: res?.parsed,
        entityData: payload,
      });

      navigate(`/${currentChain?.network}/${ROUTE.MY_COLLECTIONS}`);
    });
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
            arr.push(item);
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
          <StatusTransactionModal
            isVisible={isLoadingSubmitResult}
            description="Creating collection"
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
