import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Outlet, useNavigate } from 'react-router-dom';
import { Text, Button, useNotifications } from '@unique-nft/ui-kit';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { useAccounts, useApi, useBalanceInsufficient } from '@app/hooks';
import { CollectionApiService, useExtrinsicFee, useExtrinsicFlow } from '@app/api';
import { ROUTE } from '@app/routes';
import {
  Alert,
  CollectionSidebar,
  CollectionStepper,
  Confirm,
  MintingBtn,
  StatusTransactionModal,
} from '@app/components';
import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';
import { withPageTitle } from '@app/HOCs/withPageTitle';

import { NO_BALANCE_MESSAGE } from '../constants';
import { CollectionForm, Warning } from './types';
import { ButtonGroup, FormWrapper } from '../components/FormComponents';
import { tabsUrls, warnings } from './constants';
import { useCollectionFormMapper } from './useCollectionFormMapper';

interface CreateCollectionProps {
  className?: string;
}

const CreateCollectionComponent = ({ className }: CreateCollectionProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [warning, setWarning] = useState<Warning | null>();

  const navigate = useNavigate();
  const { currentChain } = useApi();
  const { error, info } = useNotifications();
  const { selectedAccount } = useAccounts();
  const formMapper = useCollectionFormMapper();
  const { flowStatus, flowError, isFlowLoading, signAndSubmitExtrinsic } =
    useExtrinsicFlow(CollectionApiService.collectionCreateMutation);
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
        collection,
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
      collection,
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
      <WrapperContent>
        <FormWrapper>
          <CollectionStepper activeStep={currentStep} onClickStep={goToPreviousStep} />
          {isolatedCollectionForm}
          <Alert type="warning">
            A fee of ~{feeFormatted} can be applied to the transaction
          </Alert>
          <ButtonGroup>
            {!isLastStep && (
              <MintingBtn
                iconRight={{
                  color: 'currentColor',
                  name: 'arrow-right',
                  size: 12,
                }}
                title="Next step"
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
      </WrapperContent>
      <CollectionSidebar collectionForm={collectionFormValues as CollectionForm} />
    </MainWrapper>
  );
};

export const CreateCollection = withPageTitle({ header: 'Create a collection' })(
  CreateCollectionComponent,
);
