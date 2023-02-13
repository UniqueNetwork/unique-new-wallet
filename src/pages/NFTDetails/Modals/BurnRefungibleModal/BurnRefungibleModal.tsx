import React, { useEffect } from 'react';
import { Text, useNotifications } from '@unique-nft/ui-kit';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Address } from '@unique-nft/utils/address';

import { useAccounts, useApi } from '@app/hooks';
import { useTokenGetBalance } from '@app/api';
import { useTokenRefungibleBurn } from '@app/api/restApi/token/useTokenRefungibleBurn';
import { Button, Modal } from '@app/components';
import {
  FormWrapper,
  TransferRow,
  InputAmount,
} from '@app/pages/NFTDetails/Modals/Transfer';
import { ROUTE } from '@app/routes';
import { formatBlockNumber } from '@app/utils';

import { TokenModalsProps } from '../NFTModals';
import { TNestingToken } from '../../type';
import { BurnRefungibleFormDataType } from './types';
import { BurnRefungibleStagesModal } from './BurnRefungibleStagesModal';

export const BurnRefungibleModal = <T extends TNestingToken>({
  token,
  onClose,
  onComplete,
}: TokenModalsProps<T>) => {
  const { selectedAccount } = useAccounts();
  const { info, error } = useNotifications();
  const { currentChain } = useApi();
  const navigate = useNavigate();

  const {
    getFee,
    feeFormatted,
    submitWaitResult,
    isLoadingSubmitResult,
    feeError,
    feeLoading,
    submitWaitResultError,
  } = useTokenRefungibleBurn();

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
    if (!isValid || !token || !selectedAccount?.address || !burnDebounceValue) {
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
      if (Number(amount) === fractionsBalance?.amount) {
        navigate(`/${currentChain?.network}/${ROUTE.MY_TOKENS}`);
      }
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
          disabled={!isValid}
          role="primary"
          onClick={form.handleSubmit(burnHandler)}
        />
      }
      onClose={onClose}
    >
      <FormWrapper
        fee={isValid && feeFormatted && !feeLoading ? feeFormatted : undefined}
        feeWarning="A fee will be calculated after entering the number of fractions"
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
                        <Text size="s" color="grey-500">{`You own: ${formatBlockNumber(
                          fractionsBalance?.amount || 0,
                        )}`}</Text>
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
