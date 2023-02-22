import { useEffect, useState } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { Address } from '@unique-nft/utils/address';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { TransferTokenBody } from '@unique-nft/sdk';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';

import { useAccounts, useFormValidator } from '@app/hooks';
import { TransferStagesModal } from '@app/pages/NFTDetails/Modals/Transfer/TransferModal';
import { useTokenTransfer } from '@app/api';
import { TBaseToken } from '@app/pages/NFTDetails/type';
import { TokenModalsProps } from '@app/pages/NFTDetails/Modals';
import { Modal, TransferBtn } from '@app/components';
import { FormWrapper } from '@app/pages/NFTDetails/Modals/Transfer/components/FormWrapper';
import { TransferRow } from '@app/pages/NFTDetails/Modals/Transfer/components/TransferRow';
import { InputTransfer } from '@app/pages/NFTDetails/Modals/Transfer/components/InputTransfer';
import { TransferFormDataType } from '@app/pages/NFTDetails/Modals/Transfer/type';
import { useGetTokenPath } from '@app/hooks/useGetTokenPath';
import { FORM_ERRORS } from '@app/pages/constants';

export const TransferModalComponent = <T extends TBaseToken>({
  token,
  onClose,
  onComplete,
}: TokenModalsProps<T>) => {
  const { selectedAccount } = useAccounts();
  const { error, info } = useNotifications();
  const getTokenPath = useGetTokenPath();
  const navigate = useNavigate();
  const [isWaitingComplete, setIsWaitingComplete] = useState(false);
  const {
    submitWaitResult,
    getFee,
    isLoadingSubmitResult,
    feeFormatted,
    submitWaitResultError,
    feeLoading,
    feeError,
  } = useTokenTransfer();
  const { errorMessage, isValid } = useFormValidator();

  const { control, handleSubmit } = useFormContext<TransferFormDataType>();

  const formValues = useWatch({ control });
  const [transferDebounceValue] = useDebounce(formValues, 300);

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

  const onSubmit = async (data: TransferFormDataType) => {
    try {
      setIsWaitingComplete(true);
      await submitWaitResult({
        payload: data,
      });
      await onComplete();
      setIsWaitingComplete(false);
      info('Transfer completed successfully');
      navigate(getTokenPath(data.to, data.collectionId, data.tokenId));
    } catch {
      setIsWaitingComplete(false);
      onClose();
    }
  };

  useEffect(() => {
    isValid &&
      transferDebounceValue &&
      getFee(transferDebounceValue as TransferTokenBody);
  }, [transferDebounceValue, getFee]);

  if (!selectedAccount || !token) {
    return null;
  }

  if (isLoadingSubmitResult || isWaitingComplete) {
    return <TransferStagesModal />;
  }

  return (
    <Modal
      isVisible={true}
      title="Transfer NFT"
      footerButtons={
        <TransferBtn
          title="Confirm"
          role="primary"
          disabled={!isValid}
          tooltip={errorMessage}
          onClick={handleSubmit(onSubmit)}
        />
      }
      onClose={onClose}
    >
      <FormWrapper
        fee={isValid && feeFormatted && !feeLoading ? feeFormatted : undefined}
        feeLoading={feeLoading}
      >
        <FormProvider {...form}>
          <TransferRow>
            <Controller
              name="to"
              render={({ field: { value, onChange }, fieldState }) => {
                return (
                  <InputTransfer
                    value={value}
                    error={!!fieldState.error}
                    statusText={fieldState.error?.message}
                    onChange={onChange}
                    onClear={() => onChange('')}
                  />
                );
              }}
              rules={{
                required: true,
                validate: (val: string) =>
                  Address.is.ethereumAddress(val) ||
                  Address.is.substrateAddress(val) ||
                  'Invalid address',
              }}
            />
          </TransferRow>
        </FormProvider>
      </FormWrapper>
    </Modal>
  );
};

export const TransferModal = <T extends TBaseToken>(props: NFTModalsProps<T>) => {
  const { token } = props;
  const { selectedAccount } = useAccounts();

  const form = useForm<TransferFormDataType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      to: '',
      from: selectedAccount?.address,
      address: selectedAccount?.address,
      tokenId: token?.tokenId,
      collectionId: token?.collectionId,
    },
  });

  return (
    <FormProvider {...form}>
      <TransferModalComponent {...props} />
    </FormProvider>
  );
};
