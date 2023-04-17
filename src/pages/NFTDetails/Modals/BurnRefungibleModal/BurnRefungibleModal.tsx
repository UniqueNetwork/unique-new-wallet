import React, { useEffect, useMemo, useState } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { Controller, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Address } from '@unique-nft/utils/address';
import { BurnRefungibleBody, BurnRefungibleParsed } from '@unique-nft/sdk';

import { useAccounts, useApi } from '@app/hooks';
import { useTokenGetBalance } from '@app/api';
import { useTokenRefungibleBurn } from '@app/api/restApi/token/useTokenRefungibleBurn';
import { Modal, TransferBtn, Typography } from '@app/components';
import {
  FormWrapper,
  TransferRow,
  InputAmount,
} from '@app/pages/NFTDetails/Modals/Transfer';
import { ROUTE } from '@app/routes';
import { formatBlockNumber } from '@app/utils';
import { useTransactionFormService } from '@app/hooks/useTransactionModalService';

import { TokenModalsProps } from '../NFTModals';
import { TNestingToken } from '../../type';
import { BurnRefungibleFormDataType } from './types';
import { BurnRefungibleStagesModal } from './BurnRefungibleStagesModal';
import { NOT_ENOUGH_BALANCE_MESSAGE } from '../constants';

export const BurnRefungibleModal = <T extends TNestingToken>({
  token,
  onClose,
  onComplete,
}: TokenModalsProps<T>) => {
  const { selectedAccount } = useAccounts();
  const { info } = useNotifications();
  const { currentChain } = useApi();
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
    BurnRefungibleParsed,
    BurnRefungibleBody,
    BurnRefungibleFormDataType
  >({
    MutateAsyncFunction: useTokenRefungibleBurn,
    account: selectedAccount,
    defaultValues: {
      amount: 1,
    },
  });

  const { formState, handleSubmit } = form;

  const { data: fractionsBalance } = useTokenGetBalance({
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

  useEffect(() => {
    if (
      !formState.isValid ||
      !token ||
      !selectedAccount?.address ||
      !debouncedFormValues
    ) {
      return;
    }

    getFee({
      address: selectedAccount.address,
      collectionId: token.collectionId,
      tokenId: token.tokenId,
      amount: debouncedFormValues.amount || 1,
    });
  }, [debouncedFormValues, token, selectedAccount?.address, formState.isValid]);

  const burnHandler = async ({ amount }: BurnRefungibleFormDataType) => {
    if (!token || !selectedAccount?.address || !formState.isValid) {
      return;
    }
    try {
      setIsWaitingComplete(true);
      await submitWaitResult({
        payload: {
          address: selectedAccount.address,
          collectionId: token.collectionId,
          tokenId: token.tokenId,
          amount,
        },
      });

      info('RFT burned successfully');
      if (Number(amount) === fractionsBalance?.amount) {
        navigate(`/${currentChain?.network}/${ROUTE.MY_TOKENS}`);
      }
      await onComplete();
    } catch {
      onClose();
    } finally {
      setIsWaitingComplete(false);
    }
  };

  const validationMessage = useMemo(() => {
    if (!form.formState.isValid) {
      return 'Please enter a valid number of fractions';
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
    return <BurnRefungibleStagesModal />;
  }

  return (
    <Modal
      isVisible={true}
      title="Burn fractional token"
      footerButtons={
        <TransferBtn
          title="Confirm"
          disabled={!formState.isValid || !isSufficientBalance}
          role="primary"
          tooltip={validationMessage}
          onClick={handleSubmit(burnHandler)}
        />
      }
      onClose={onClose}
    >
      <FormWrapper
        fee={formState.isValid && feeFormatted && !feeLoading ? feeFormatted : undefined}
        feeWarning="A fee will be calculated after entering the number of fractions"
        feeLoading={feeLoading}
      >
        <FormProvider {...form}>
          <TransferRow>
            <Controller
              name="amount"
              render={({ field: { value, onChange }, fieldState }) => {
                return (
                  <InputAmount
                    label={
                      <LabelWrapper>
                        Number of fractions
                        <Typography
                          size="s"
                          color="grey-500"
                        >{`You own: ${formatBlockNumber(
                          fractionsBalance?.amount || 0,
                        )}`}</Typography>
                      </LabelWrapper>
                    }
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
        </FormProvider>
      </FormWrapper>
    </Modal>
  );
};

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--prop-gap) / 4);
`;
