import { useEffect, useState } from 'react';
import { Loader, useNotifications } from '@unique-nft/ui-kit';
import { Address } from '@unique-nft/utils/address';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { TransferTokenBody } from '@unique-nft/sdk';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';

import { useAccounts } from '@app/hooks';
import { useTokenGetBalance } from '@app/api/restApi/token/useTokenGetBalance';
import { useTokenRefungibleTransfer } from '@app/api';
import { Modal, TransferBtn } from '@app/components';
import { useGetTokenPath } from '@app/hooks/useGetTokenPath';

import { TNestingToken } from '../../../type';
import { TokenModalsProps } from '../../NFTModals';
import { TransferRefungibleStagesModal } from './TransferRefungibleStagesModal';
import { FormWrapper, TransferRow, InputTransfer, InputAmount } from '../components';
import { TransferRefungibleFormDataType } from '../type';

export const TransferRefungibleModal = <T extends TNestingToken>({
  token,
  onComplete,
  onClose,
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
  } = useTokenRefungibleTransfer();

  const { data: fractionsBalance, isFetching: isFetchingBalance } = useTokenGetBalance({
    collectionId: token?.collectionId,
    tokenId: token?.tokenId,
    address: token?.nestingParentToken
      ? Address.nesting.idsToAddress(
          token.nestingParentToken.collectionId,
          token.nestingParentToken.tokenId,
        )
      : selectedAccount?.address,
    isFractional: true,
  });

  const form = useForm<TransferRefungibleFormDataType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      to: '',
      from: token?.nestingParentToken
        ? Address.nesting.idsToAddress(
            token.nestingParentToken.collectionId,
            token.nestingParentToken.tokenId,
          )
        : selectedAccount?.address,
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

  const onSubmit = async (data: TransferRefungibleFormDataType) => {
    try {
      setIsWaitingComplete(true);
      await submitWaitResult({
        payload: {
          ...data,
          amount: Number(data.amount),
        },
      });
      info('Transfer completed successfully');

      if (token?.nestingParentToken && fractionsBalance?.amount === Number(data.amount)) {
        navigate(getTokenPath(data.to, data.collectionId, data.tokenId));
        return;
      }
      await onComplete();
      if (fractionsBalance?.amount === Number(data.amount)) {
        navigate(getTokenPath(data.to, data.collectionId, data.tokenId));
        return;
      }
      setIsWaitingComplete(false);
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
    return <TransferRefungibleStagesModal />;
  }

  return (
    <Modal
      isVisible={true}
      title="Transfer fractional token"
      footerButtons={
        <TransferBtn
          title="Confirm"
          disabled={!isValid}
          role="primary"
          onClick={form.handleSubmit(onSubmit)}
        />
      }
      onClose={onClose}
    >
      {isFetchingBalance && <Loader isFullPage={true} />}
      <FormWrapper
        fee={isValid && feeFormatted && !feeLoading ? feeFormatted : undefined}
        feeLoading={feeLoading}
      >
        <FormProvider {...form}>
          <TransferRow>
            <Controller
              name="amount"
              render={({ field: { value, onChange }, fieldState }) => {
                return (
                  <InputAmount
                    value={value}
                    maxValue={fractionsBalance?.amount || 0}
                    error={!!fieldState.error}
                    statusText={fieldState.error?.message}
                    onChange={onChange}
                    onClear={() => onChange('')}
                  />
                );
              }}
              rules={{
                required: true,
                validate: (val: string) => {
                  return (
                    (Number(val) > 0 &&
                      Number(val) <= (fractionsBalance?.amount || 0) &&
                      /^\d+$/.test(val)) ||
                    'Invalid number of fractions'
                  );
                },
              }}
            />
          </TransferRow>
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
