import { useEffect } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { Address } from '@unique-nft/utils/address';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { TransferTokenBody } from '@unique-nft/sdk';
import { useDebounce } from 'use-debounce';

import { useAccounts } from '@app/hooks';
import { useTokenGetBalance } from '@app/api/restApi/token/useTokenGetBalance';
import { useTokenTransfer } from '@app/api';
import { Modal, TransferBtn } from '@app/components';

import { TBaseToken } from '../../../type';
import { TokenModalsProps } from '../../NFTModals';
import { TransferRefungibleStagesModal } from './TransferRefungibleStagesModal';
import { FormWrapper, TransferRow, InputTransfer, InputAmount } from '../components';
import { TransferRefungibleFormDataType } from '../type';

export const TransferRefungibleModal = <T extends TBaseToken>({
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

  const { data: fractionsBalance } = useTokenGetBalance({
    collectionId: token?.collectionId,
    tokenId: token?.tokenId,
    address: selectedAccount?.address,
    isRefungble: true,
  });

  const form = useForm<TransferRefungibleFormDataType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      to: '',
      from: selectedAccount?.address,
      address: selectedAccount?.address,
      tokenId: token?.tokenId,
      collectionId: token?.collectionId,
      amount: 1,
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

  const onSubmit = (data: TransferRefungibleFormDataType) => {
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
    return <TransferRefungibleStagesModal />;
  }

  return (
    <Modal
      isVisible={true}
      title="Transfer fractional token"
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
              name="amount"
              render={({ field: { value, onChange } }) => {
                return (
                  <InputAmount
                    value={value}
                    maxValue={fractionsBalance?.amount || 0}
                    onChange={onChange}
                    onClear={() => onChange('')}
                  />
                );
              }}
              rules={{
                required: true,
                validate: (val: string) => Number(val) > 0,
              }}
            />
          </TransferRow>
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
