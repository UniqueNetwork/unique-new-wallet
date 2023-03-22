import { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import classNames from 'classnames';
import { useDebounce } from 'use-debounce';
import { Text, useNotifications } from '@unique-nft/ui-kit';

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
  Button,
  CollectionSidebar,
  CollectionStepper,
  Confirm,
  ConfirmBtn,
  StatusTransactionModal,
} from '@app/components';
import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { BottomBar } from '@app/pages/components/BottomBar';

import { FORM_ERRORS, NO_BALANCE_MESSAGE } from '../constants';
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
    if (!selectedAccount) {
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
  }, [collectionDebounceValue, getFee, isValid]);

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
    if (isBalanceInsufficient) {
      return NO_BALANCE_MESSAGE;
    }

    if (!isValid) {
      return Object.values(errors)
        .map((error) => {
          if (Array.isArray(error)) {
            return error.map(({ message }) => message).join(' ');
          }
          return error.message;
        })
        .join(' ');
    }
    return null;
  }, [isBalanceInsufficient, isValid, errors]);

  return (
    <MainWrapper className={classNames('create-collection-page', className)}>
      <WrapperContentStyled>
        <FormWrapper>
          <CollectionStepper activeStep={currentStep} onClickStep={goToPreviousStep} />
          {isolatedCollectionForm}
          <FeeInformationTransaction fee={feeFormatted} />
          <ButtonGroup>
            {!isLastStep && (
              <ConfirmBtn
                iconRight={{
                  color: 'currentColor',
                  name: 'arrow-right',
                  size: 12,
                }}
                title="Next step"
                disabled={!isValid}
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
                disabled={!isValid || isBalanceInsufficient}
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
            <Text>{warning?.description}</Text>
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
              title={isDrawerOpen ? 'Back' : 'Preview'}
              key="toggleDrawer"
              onClick={() => setDrawerOpen(!isDrawerOpen)}
            />,
          ]}
          isOpen={isDrawerOpen}
          parent={document.body}
        >
          <CollectionSidebar collectionForm={collectionFormValues as CollectionForm} />
        </BottomBar>
      )}
    </MainWrapper>
  );
};

export const CreateCollection = withPageTitle({
  header: 'Create a collection',
  backLink: ROUTE.MY_COLLECTIONS,
})(CreateCollectionComponent);
