import { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import styled from 'styled-components';
import classNames from 'classnames';
import { useDebounce } from 'use-debounce';
import { Button, Text, useNotifications } from '@unique-nft/ui-kit';

import {
  DeviceSize,
  useAccounts,
  useApi,
  useBalanceInsufficient,
  useDeviceSize,
} from '@app/hooks';
import { CollectionApiService, useExtrinsicFee, useExtrinsicFlow } from '@app/api';
import { ROUTE } from '@app/routes';
import {
  CollectionSidebar,
  CollectionStepper,
  Confirm,
  MintingBtn,
  StatusTransactionModal,
} from '@app/components';
import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';
import { withPageTitle } from '@app/HOCs/withPageTitle';
import { FeeInformationTransaction } from '@app/components/FeeInformationTransaction';
import { BottomBar } from '@app/pages/components/BottomBar';

import { NO_BALANCE_MESSAGE } from '../constants';
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
  const { flowStatus, flowError, isFlowLoading, signAndSubmitExtrinsic } =
    useExtrinsicFlow(CollectionApiService.collectionCreateMutation, 'create-collection');
  const { feeError, isFeeError, fee, feeFormatted, getFee } = useExtrinsicFee(
    CollectionApiService.collectionCreateMutation,
  );
  const { isBalanceInsufficient } = useBalanceInsufficient(selectedAccount?.address, fee);

  const collectionForm = useForm<CollectionForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      symbol: '',
      description: '',
      address: selectedAccount?.address,
    },
  });
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = collectionForm;
  const collectionFormValues = useWatch<CollectionForm>({
    control,
  });

  const [collectionDebounceValue] = useDebounce(collectionFormValues as any, 500);

  useEffect(() => {
    if (isFeeError) {
      error(feeError?.message);
    }
  }, [isFeeError]);

  useEffect(() => {
    if (flowStatus === 'success') {
      info('Collection created successfully');

      navigate(`/${currentChain?.network}/${ROUTE.MY_COLLECTIONS}`);
    }
    if (flowStatus === 'error') {
      error(flowError?.message);
    }
  }, [flowStatus, navigate]);

  useEffect(() => {
    navigate(tabsUrls[currentStep - 1]);
  }, [currentStep, navigate]);

  useEffect(() => {
    if (collectionDebounceValue) {
      const collection = formMapper(collectionDebounceValue);
      getFee({
        payload: collection,
      });
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

  const onSubmit = (form: CollectionForm) => {
    if (!selectedAccount) {
      error('Account is not found');
      return;
    }

    const collection = formMapper(form);

    signAndSubmitExtrinsic({
      payload: collection,
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

  return (
    <MainWrapper className={classNames('create-collection-page', className)}>
      <WrapperContentStyled>
        <FormWrapper>
          <CollectionStepper activeStep={currentStep} onClickStep={goToPreviousStep} />
          {isolatedCollectionForm}
          <FeeInformationTransaction fee={feeFormatted} />
          <ButtonGroup>
            {!isLastStep && (
              <MintingBtn
                iconRight={{
                  color: 'currentColor',
                  name: 'arrow-right',
                  size: 12,
                }}
                title="Next step"
                disabled={!isValid}
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
              <MintingBtn
                role="primary"
                title="Create collection"
                tooltip={isBalanceInsufficient ? NO_BALANCE_MESSAGE : undefined}
                disabled={!isValid || isBalanceInsufficient}
                onClick={handleSubmit(onSubmit)}
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
                onClick: () => {
                  goToNextStep(2);
                  setWarning(null);
                },
              },
            ]}
            isVisible={!!warning}
            title={warning?.title}
            onClose={() => setWarning(null)}
          >
            <Text>{warning?.description}</Text>
          </Confirm>
          <StatusTransactionModal
            isVisible={isFlowLoading}
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
