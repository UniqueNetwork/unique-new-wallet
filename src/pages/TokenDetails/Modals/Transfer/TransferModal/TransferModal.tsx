import { useEffect, useMemo, useState } from 'react';
import { Address } from '@unique-nft/utils/address';
import { Controller, FormProvider } from 'react-hook-form';
import { TransferTokenBody, TransferTokenParsed } from '@unique-nft/sdk';
import { useNavigate } from 'react-router-dom';

import { useAccounts } from '@app/hooks';
import { TransferStagesModal } from '@app/pages/TokenDetails/Modals/Transfer/TransferModal';
import { useTokenTransfer } from '@app/api';
import { TBaseToken } from '@app/pages/TokenDetails/type';
import { TokenModalsProps } from '@app/pages/TokenDetails/Modals';
import { Modal, TransferBtn, useNotifications } from '@app/components';
import { FormWrapper } from '@app/pages/TokenDetails/Modals/Transfer/components/FormWrapper';
import { TransferRow } from '@app/pages/TokenDetails/Modals/Transfer/components/TransferRow';
import { InputTransfer } from '@app/pages/TokenDetails/Modals/Transfer/components/InputTransfer';
import { TransferFormDataType } from '@app/pages/TokenDetails/Modals/Transfer/type';
import { useGetTokenPath } from '@app/hooks/useGetTokenPath';
import { useTransactionFormService } from '@app/hooks/useTransactionModalService';

import { INVALID_ADDRESS_MESSAGE, NOT_ENOUGH_BALANCE_MESSAGE } from '../../constants';

export const TransferModal = <T extends TBaseToken>({
  token,
  onClose,
  onComplete,
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
    TransferTokenParsed,
    TransferTokenBody,
    TransferFormDataType
  >({
    MutateAsyncFunction: useTokenTransfer,
    account: selectedAccount,
    defaultValues: {
      to: '',
      from:
        token?.owner && Address.is.ethereumAddress(token.owner)
          ? token?.owner
          : selectedAccount?.address,
      address: selectedAccount?.address,
      tokenId: token?.tokenId,
      collectionId: token?.collectionId,
    },
  });

  const { formState, handleSubmit } = form;

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
    formState.isValid &&
      debouncedFormValues &&
      getFee(debouncedFormValues as TransferTokenBody);
  }, [debouncedFormValues, getFee]);

  const validationMessage = useMemo(() => {
    if (!form.formState.isValid) {
      return INVALID_ADDRESS_MESSAGE;
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
    return <TransferStagesModal />;
  }

  return (
    <Modal
      isVisible={true}
      title="Transfer NFT"
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
      <FormWrapper
        fee={formState.isValid && feeFormatted && !feeLoading ? feeFormatted : undefined}
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
