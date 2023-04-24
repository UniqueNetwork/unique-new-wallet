import { useEffect, useMemo, useState } from 'react';
import { Address } from '@unique-nft/utils/address';
import { Controller, FormProvider } from 'react-hook-form';
import {
  TransferRefungibleTokenParsed,
  TransferRefungibleTokenRequest,
  TransferTokenBody,
} from '@unique-nft/sdk';
import { useNavigate } from 'react-router-dom';

import { useAccounts } from '@app/hooks';
import { useTokenGetBalance } from '@app/api/restApi/token/useTokenGetBalance';
import { useTokenRefungibleTransfer } from '@app/api';
import { Modal, TransferBtn, Loader, useNotifications } from '@app/components';
import { useGetTokenPath } from '@app/hooks/useGetTokenPath';
import { useTransactionFormService } from '@app/hooks/useTransactionModalService';

import { TNestingToken } from '../../../type';
import { TokenModalsProps } from '../../NFTModals';
import { TransferRefungibleStagesModal } from './TransferRefungibleStagesModal';
import { FormWrapper, TransferRow, InputTransfer, InputAmount } from '../components';
import { TransferRefungibleFormDataType } from '../type';
import { NOT_ENOUGH_BALANCE_MESSAGE } from '../../constants';

export const TransferRefungibleModal = <T extends TNestingToken>({
  token,
  onComplete,
  onClose,
}: TokenModalsProps<T>) => {
  const { selectedAccount } = useAccounts();
  const { info } = useNotifications();
  const getTokenPath = useGetTokenPath();
  const navigate = useNavigate();
  const [isWaitingComplete, setIsWaitingComplete] = useState(false);

  const {
    form,
    submitWaitResult,
    getFee,
    feeFormatted,
    feeLoading,
    debouncedFormValues,
    isSufficientBalance,
  } = useTransactionFormService<
    TransferRefungibleTokenParsed,
    TransferRefungibleTokenRequest,
    TransferRefungibleFormDataType
  >({
    MutateAsyncFunction: useTokenRefungibleTransfer,
    account: selectedAccount,
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

  const { formState, handleSubmit } = form;

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
    formState.isValid &&
      debouncedFormValues &&
      getFee(debouncedFormValues as TransferTokenBody);
  }, [debouncedFormValues, getFee]);

  const validationMessage = useMemo(() => {
    if (!form.formState.isValid) {
      return 'Please enter a valid number of fractions and address';
    }
    if (!isSufficientBalance) {
      return `${NOT_ENOUGH_BALANCE_MESSAGE} ${selectedAccount?.unitBalance || 'coins'}`;
    }
    return null;
  }, [form.formState, isSufficientBalance, selectedAccount]);

  if (!selectedAccount || !token) {
    return null;
  }

  if (isWaitingComplete) {
    return <TransferRefungibleStagesModal />;
  }

  return (
    <Modal
      isVisible={true}
      title="Transfer fractional token"
      footerButtons={
        <TransferBtn
          title="Confirm"
          disabled={!formState.isValid || !isSufficientBalance}
          role="primary"
          tooltip={validationMessage}
          onClick={handleSubmit(onSubmit)}
        />
      }
      onClose={onClose}
    >
      {isFetchingBalance && <Loader isFullPage={true} />}
      <FormWrapper
        fee={formState.isValid && feeFormatted && !feeLoading ? feeFormatted : undefined}
        feeWarning="A fee will be calculated after entering the address and number of fractions"
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
                validate: (val: string) => {
                  if (
                    selectedAccount?.address
                      .toLowerCase()
                      .localeCompare(val.trim().toLowerCase()) === 0
                  ) {
                    return 'Invalid address';
                  }
                  return (
                    Address.is.ethereumAddress(val) ||
                    Address.is.substrateAddress(val) ||
                    'Invalid address'
                  );
                },
              }}
            />
          </TransferRow>
        </FormProvider>
      </FormWrapper>
    </Modal>
  );
};
