import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Outlet, useNavigate } from 'react-router-dom';
import { Heading, Text, Button, useNotifications } from '@unique-nft/ui-kit';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { useAccounts, useBalanceInsufficient } from '@app/hooks';
import { CollectionApiService, useExtrinsicFee, useExtrinsicFlow } from '@app/api';
import { CREATE_COLLECTION_TABS_ROUTE, ROUTE } from '@app/routes';
import {
  Alert,
  CollectionSidebar,
  CollectionStepper,
  Confirm,
  MintingBtn,
  StatusTransactionModal,
  TooltipButtonWrapper,
} from '@app/components';
import { MainWrapper, WrapperContent } from '@app/pages/components/PageComponents';

import { CreateCollectionFormType } from './tabs';
import { ButtonGroup, FormWrapper } from '../components/FormComponents';
import { NO_BALANCE_MESSAGE } from '../constants';

type Warning = {
  title: string;
  description: string;
};

interface CreateCollectionProps {
  className?: string;
}

const tabsUrls = [
  `${ROUTE.CREATE_COLLECTION}/${CREATE_COLLECTION_TABS_ROUTE.MAIN_INFORMATION}`,
  `${ROUTE.CREATE_COLLECTION}/${CREATE_COLLECTION_TABS_ROUTE.NFT_ATTRIBUTES}`,
];

const warnings: Record<string, Warning> = {
  coverIsNotDefine: {
    title:
      'You have not entered the cover. Are you sure that you want to create the collection without it?',
    description: 'You cannot return to editing the cover in this product version.',
  },
  attributesAreNotDefine: {
    title:
      'You have not entered attributes. Are you sure that you want to create the collection without them?',
    description: 'You cannot return to editing the attributes in this product version.',
  },
};

export const CreateCollection = ({ className }: CreateCollectionProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [warning, setWarning] = useState<Warning | null>();

  const navigate = useNavigate();
  const { error, info } = useNotifications();
  const { selectedAccount } = useAccounts();
  const { flowStatus, flowError, isFlowLoading, signAndSubmitExtrinsic } =
    useExtrinsicFlow(CollectionApiService.collectionCreateMutation);
  const { feeError, isFeeError, fee, feeFormatted, getFee } = useExtrinsicFee(
    CollectionApiService.collectionCreateMutation,
  );
  const { isBalanceInsufficient } = useBalanceInsufficient(selectedAccount?.address, fee);

  const collectionForm = useForm<CreateCollectionFormType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      address: selectedAccount?.address,
      name: '',
      description: '',
      tokenPrefix: '',
      schema: {
        coverPicture: {
          ipfsCid: '',
        },
        attributesSchema: {},
        attributesSchemaVersion: '1.0.0',
        image: {
          urlTemplate: 'string{infix}.ext',
        },
        schemaName: 'unique',
        schemaVersion: '1.0.0',
      },
    },
  });
  const { control, formState, handleSubmit } = collectionForm;
  const collectionFormValues = useWatch({
    control,
  }) as CreateCollectionFormType;

  const [collectionDebounceValue] = useDebounce(collectionFormValues, 500);

  useEffect(() => {
    if (isFeeError) {
      error(feeError?.message);
    }
  }, [isFeeError]);

  useEffect(() => {
    if (flowStatus === 'success') {
      info('Collection created successfully');

      navigate(ROUTE.MY_COLLECTIONS);
    }
    if (flowStatus === 'error') {
      error(flowError?.message);
    }
  }, [flowStatus, navigate]);

  useEffect(() => {
    navigate(tabsUrls[currentStep - 1]);
  }, [currentStep, navigate]);

  useEffect(() => {
    console.log(collectionDebounceValue);

    if (collectionDebounceValue) {
      getFee({
        collection: collectionDebounceValue,
      });
    }
  }, [collectionDebounceValue, getFee]);

  const goToNextStep = (step: number) => setCurrentStep(step);
  const goToPreviousStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };
  const onNextStep = (values: CreateCollectionFormType) => {
    if (!values.schema?.coverPicture?.ipfsCid) {
      setWarning(warnings.coverIsNotDefine);
      return;
    }

    goToNextStep(currentStep + 1);
  };

  const onSubmit = (values: CreateCollectionFormType) => {
    if (!selectedAccount) {
      error('Account is not found');
      return;
    }
    console.log(values);
    // signAndSubmitExtrinsic({
    //   collection: values,
    // });
  };

  const isFirstStep = currentStep - 1 === 0;
  const isLastStep = currentStep === tabsUrls.length;

  return (
    <FormProvider {...collectionForm}>
      <Heading size="1">Create a collection</Heading>
      <MainWrapper className={classNames('create-collection-page', className)}>
        <WrapperContent>
          <FormWrapper>
            <CollectionStepper activeStep={currentStep} onClickStep={goToPreviousStep} />
            <Outlet />
            <Alert type="warning">
              A fee of ~{feeFormatted} can be applied to the transaction
            </Alert>
            <ButtonGroup>
              {!isLastStep && (
                <MintingBtn
                  disabled={!formState.isValid}
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
              {isBalanceInsufficient && isLastStep && (
                <TooltipButtonWrapper message={NO_BALANCE_MESSAGE}>
                  <Button
                    type="button"
                    role="primary"
                    disabled={true}
                    title="Create a collection"
                  />
                </TooltipButtonWrapper>
              )}
              {isLastStep && (
                <Button
                  role="primary"
                  type="submit"
                  title="Create a collection"
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
        <CollectionSidebar />
      </MainWrapper>
    </FormProvider>
  );
};
