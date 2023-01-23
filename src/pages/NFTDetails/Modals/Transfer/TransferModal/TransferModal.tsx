import { useEffect } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { Address } from '@unique-nft/utils/address';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { TransferTokenBody } from '@unique-nft/sdk';
import { useDebounce } from 'use-debounce';

import { useAccounts } from '@app/hooks';
import { TransferStagesModal } from '@app/pages/NFTDetails/Modals/Transfer/TransferModal';
import { useTokenTransfer } from '@app/api';
import { TBaseToken } from '@app/pages/NFTDetails/type';
import { TokenModalsProps } from '@app/pages/NFTDetails/Modals';
import { Modal, TransferBtn } from '@app/components';
import { FormWrapper } from '@app/pages/NFTDetails/Modals/Transfer/components/FormWrapper';
import { TransferRow } from '@app/pages/NFTDetails/Modals/Transfer/components/TransferRow';
import { InputTransfer } from '@app/pages/NFTDetails/Modals/Transfer/components/InputTransfer';
import { TransferFormDataType } from '@app/pages/NFTDetails/Modals/Transfer/type';

export const TransferModal = <T extends TBaseToken>({
  token,
  onComplete,
  onClose,
}: TokenModalsProps<T>) => {
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

  const {
    formState: { isValid },
    control,
  } = form;

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
          disabled={!isValid || feeLoading}
          role="primary"
          onClick={form.handleSubmit(onSubmit)}
        />
      }
      onClose={onClose}
    >
      <FormWrapper
        fee={isValid && feeFormatted && !feeLoading ? feeFormatted : undefined}
      >
        <FormProvider {...form}>
          <TransferRow>
            <Controller
              name="to"
              render={({ field: { value, onChange } }) => {
                return (
                  <InputTransfer
                    value={value}
                    onChange={onChange}
                    onClear={() => onChange('')}
                  />
                );
              }}
              rules={{
                required: true,
                validate: (val: string) =>
                  Address.is.ethereumAddress(val) || Address.is.substrateAddress(val),
              }}
            />
          </TransferRow>
        </FormProvider>
      </FormWrapper>
    </Modal>
  );
};
