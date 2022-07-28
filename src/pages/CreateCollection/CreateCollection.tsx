import { useEffect, useMemo, useState } from 'react';
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
// import { CollectionFormProvider } from '@app/context/CollectionFormContext/CollectionFormProvider';

import { CreateCollectionFormType } from './tabs';
import { ButtonGroup } from '../components/FormComponents';
import { NO_BALANCE_MESSAGE } from '../constants';

interface CreateCollectionProps {
  className?: string;
}

const tabsUrls = [
  `${ROUTE.CREATE_COLLECTION}/${CREATE_COLLECTION_TABS_ROUTE.MAIN_INFORMATION}`,
  `${ROUTE.CREATE_COLLECTION}/${CREATE_COLLECTION_TABS_ROUTE.NFT_ATTRIBUTES}`,
];

export const CreateCollection = ({ className }: CreateCollectionProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

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
  const { control } = collectionForm;
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

  const goToStep = (step: number) => setCurrentStep(step);
  const goToPreviousStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };
  const onSubmit = (values: CreateCollectionFormType) => {
    if (!values.schema?.coverPicture?.ipfsCid) {
      setIsOpenConfirm(true);
      return;
    }

    goToStep(2);
  };

  const onPreviousStepClick = () => {
    navigate(
      `${ROUTE.CREATE_COLLECTION}/${CREATE_COLLECTION_TABS_ROUTE.MAIN_INFORMATION}`,
    );
  };

  const onSubmitAttributes = (values: any) => {
    if (!selectedAccount) {
      error('Account is not found');
      return;
    }
    console.log(values);
    // signAndSubmitExtrinsic({
    //   collection: values,
    // });
  };

  return (
    <FormProvider {...collectionForm}>
      <Heading size="1">Create a collection</Heading>
      <MainWrapper className={classNames('create-collection-page', className)}>
        <WrapperContent>
          <CollectionStepper activeStep={currentStep} onClickStep={goToPreviousStep} />
          <Outlet
            context={{
              goToStep,
            }}
          />
          <Alert type="warning">
            A fee of ~{feeFormatted} can be applied to the transaction
          </Alert>
          <ButtonGroup>
            <MintingBtn
              disabled={!collectionForm.formState.isValid}
              iconRight={{
                color: 'currentColor',
                name: 'arrow-right',
                size: 12,
              }}
              title="Next step"
              onClick={collectionForm.handleSubmit(onSubmit)}
            />
          </ButtonGroup>
          <Button
            iconLeft={{
              color: 'var(--color-primary-400)',
              name: 'arrow-left',
              size: 12,
            }}
            title="Previous step"
            onClick={onPreviousStepClick}
          />
          {isBalanceInsufficient ? (
            <TooltipButtonWrapper message={NO_BALANCE_MESSAGE}>
              <Button
                disabled={true}
                title="Create a collection"
                type="button"
                role="primary"
              />
            </TooltipButtonWrapper>
          ) : (
            <Button
              title="Create a collection"
              type="submit"
              role="primary"
              onClick={collectionForm.handleSubmit(onSubmitAttributes)}
            />
          )}
          <Confirm
            buttons={[
              { title: 'No, return', onClick: () => setIsOpenConfirm(false) },
              {
                title: 'Yes, I am sure',
                role: 'primary',
                type: 'submit',
                onClick: () => {
                  goToStep(2);
                },
              },
            ]}
            isVisible={isOpenConfirm}
            title="You have not entered the cover. Are you sure that you want to create the collection without it?"
            onClose={() => setIsOpenConfirm(false)}
          >
            <Text>You cannot return to editing the cover in this product version.</Text>
          </Confirm>
          <StatusTransactionModal
            isVisible={isFlowLoading}
            description="Creating collection"
          />
        </WrapperContent>
        <CollectionSidebar />
      </MainWrapper>
    </FormProvider>
  );
};
