import { useEffect } from 'react';
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

import { useAccounts, useFormValidator } from '@app/hooks';
import { TransferStagesModal } from '@app/pages/NFTDetails/Modals/Transfer/TransferModal';
import { useTokenTransfer } from '@app/api';
import { TBaseToken } from '@app/pages/NFTDetails/type';
import { NFTModalsProps } from '@app/pages/NFTDetails/Modals';
import { Modal, TransferBtn } from '@app/components';
import { FormWrapper } from '@app/pages/NFTDetails/Modals/Transfer/components/FormWrapper';
import { TransferRow } from '@app/pages/NFTDetails/Modals/Transfer/components/style';
import { InputTransfer } from '@app/pages/NFTDetails/Modals/Transfer/components/InputTransfer';
import { TransferFormDataType } from '@app/pages/NFTDetails/Modals/Transfer/type';
import { FORM_ERRORS } from '@app/pages/constants';

export const TransferModalComponent = <T extends TBaseToken>({
  token,
  onComplete,
  onClose,
}: NFTModalsProps<T>) => {
  const { selectedAccount } = useAccounts();
  const { error, info } = useNotifications();
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

  const onSubmit = (data: TransferFormDataType) => {
    submitWaitResult({
      payload: data,
    })
      .then(() => {
        info('Transfer completed successfully');
        onComplete();
      })
      .catch(() => {
        onClose();
      });
  };

  useEffect(() => {
    isValid &&
      transferDebounceValue &&
      getFee(transferDebounceValue as TransferTokenBody);
  }, [transferDebounceValue, getFee]);

  if (!selectedAccount || !token) {
    return null;
  }

  if (isLoadingSubmitResult) {
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
      >
        <TransferRow>
          <Controller
            name="to"
            render={({ field: { value, onChange } }) => {
              return <InputTransfer value={value} onChange={onChange} />;
            }}
            rules={{
              validate: (val: string) => {
                if (
                  !Address.is.ethereumAddress(val) &&
                  !Address.is.substrateAddress(val)
                ) {
                  return FORM_ERRORS.INVALID_ADDRESS;
                }
              },
            }}
          />
        </TransferRow>
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
