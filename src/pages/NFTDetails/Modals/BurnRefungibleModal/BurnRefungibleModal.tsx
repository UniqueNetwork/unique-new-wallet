import React, { useEffect } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

import { useAccounts } from '@app/hooks';
import { useTokenGetBalance } from '@app/api';
import { TBaseToken } from '@app/pages/NFTDetails/type';
import { TokenModalsProps } from '@app/pages/NFTDetails/Modals';
import { useTokenRefungibleBurn } from '@app/api/restApi/token/useTokenRefungibleBurn';
import { Button, Modal } from '@app/components';
import {
  FormWrapper,
  TransferRow,
  InputAmount,
} from '@app/pages/NFTDetails/Modals/Transfer';

import { BurnRefungibleFormDataType } from './types';
import { BurnRefungibleStagesModal } from './BurnRefungibleStagesModal';

export const BurnRefungibleModal = <T extends TBaseToken>({
  token,
  onClose,
  onComplete,
}: TokenModalsProps<T>) => {
  const { selectedAccount } = useAccounts();
  const { info, error } = useNotifications();

  const {
    getFee,
    feeFormatted,
    submitWaitResult,
    isLoadingSubmitResult,
    feeError,
    submitWaitResultError,
  } = useTokenRefungibleBurn();

  const { data: fractionsBalance } = useTokenGetBalance({
    collectionId: token?.collectionId,
    tokenId: token?.tokenId,
    address: selectedAccount?.address,
    isRefungble: true,
  });

  const form = useForm<BurnRefungibleFormDataType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      amount: 1,
    },
  });

  const {
    formState: { isValid },
    control,
  } = form;

  const formValues = useWatch({ control });
  const [burnDebounceValue] = useDebounce(formValues, 300);

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

  useEffect(() => {
    if (!token || !selectedAccount?.address || !burnDebounceValue) {
      return;
    }

    getFee({
      address: selectedAccount.address,
      collectionId: token.collectionId,
      tokenId: token.tokenId,
      amount: burnDebounceValue.amount || 1,
    });
  }, [burnDebounceValue, token, selectedAccount?.address]);

  const burnHandler = ({ amount }: BurnRefungibleFormDataType) => {
    if (!token || !selectedAccount?.address || !isValid) {
      return;
    }

    submitWaitResult({
      payload: {
        address: selectedAccount.address,
        collectionId: token.collectionId,
        tokenId: token.tokenId,
        amount,
      },
    }).then(() => {
      info('RFT burned successfully');

      onComplete();
    });
  };

  if (!selectedAccount || !token) {
    return null;
  }

  if (isLoadingSubmitResult) {
    return <BurnRefungibleStagesModal />;
  }

  return (
    <Modal
      isVisible={true}
      title="Burn fractional token"
      footerButtons={
        <Button
          title="Confirm"
          disabled={false}
          role="primary"
          onClick={form.handleSubmit(burnHandler)}
        />
      }
      onClose={onClose}
    >
      <FormWrapper
        fee={feeFormatted}
        feeWarning="A fee will be calculated after entering the amount"
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
        </FormProvider>
      </FormWrapper>
    </Modal>
  );
};
