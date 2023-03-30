import { FieldError, FieldValues, useFormContext, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { useEffect, useMemo } from 'react';
import { useNotifications } from '@unique-nft/ui-kit';
import { ExtrinsicResultResponse, FeeResponse } from '@unique-nft/sdk';
import { UseMutateAsyncFunction } from 'react-query';

import { Account, WalletsType } from '@app/account';
import {
  NOT_ENOUGH_BALANCE_MESSAGE,
  FILL_REQUIRED_MESSAGE,
} from '@app/pages/NFTDetails/Modals/constants';

import { useIsSufficientBalance } from './useBalanceInsufficient';
import { useAccounts } from './useAccounts';

const joinSeparator = '\n';

type UseMintingFormServiceReturns<R, D> = {
  MutateAsyncFunction: () => {
    fee: string | undefined;
    feeFormatted: string | undefined;
    getFee: UseMutateAsyncFunction<
      | {
          fee: FeeResponse | undefined;
        }
      | undefined,
      Error,
      D,
      unknown
    >;
    feeStatus: 'error' | 'loading' | 'idle' | 'success';
    feeLoading: boolean;
    feeError: string | null;
    submitWaitResult: UseMutateAsyncFunction<
      ExtrinsicResultResponse<R> | undefined,
      | Error
      | {
          extrinsicError: ExtrinsicResultResponse<any>;
        },
      { payload: D; senderAddress?: string | undefined }
    >;
    isLoadingSubmitResult: boolean;
    submitWaitResultError: string | undefined;
  };
  account: Account<WalletsType> | undefined;
};

export const useMintingFormService = <R, D, F extends FieldValues>({
  MutateAsyncFunction,
  account,
}: UseMintingFormServiceReturns<R, D>) => {
  const { selectedAccount } = useAccounts();
  const { error } = useNotifications();
  const {
    getFee,
    fee,
    feeFormatted,
    submitWaitResult,
    isLoadingSubmitResult,
    feeError,
    feeLoading,
    submitWaitResultError,
  } = MutateAsyncFunction();

  const isSufficientBalance = useIsSufficientBalance(account?.address, fee);

  const form = useFormContext<F>();

  const {
    control,
    formState: { isValid, errors },
  } = form;

  const formData = useWatch({ control });
  const [debouncedFormValues] = useDebounce(formData, 300);

  useEffect(() => {
    if (!feeError) {
      return;
    }

    error(feeError.toString());
  }, [feeError]);

  useEffect(() => {
    if (!submitWaitResultError) {
      return;
    }
    error(submitWaitResultError);
  }, [submitWaitResultError]);

  const validationMessage = useMemo(() => {
    if (!isValid) {
      if (!errors || !errors.length) {
        return FILL_REQUIRED_MESSAGE;
      }
      return (Object.values(errors).flat(2) as (FieldError | undefined)[])
        .reduce<FieldError[]>((arr, item) => {
          if (item && !arr.find(({ type }) => type === item.type)) {
            arr.push(item);
          }
          return arr;
        }, [])
        .map(({ message }) => message)
        .join(joinSeparator);
    }
    if (!isSufficientBalance && !feeLoading) {
      return `${NOT_ENOUGH_BALANCE_MESSAGE} ${selectedAccount?.unitBalance || 'coins'}`;
    }
    return null;
  }, [isValid, errors, feeLoading, isSufficientBalance, selectedAccount]);

  return {
    isValid,
    form,
    formData,
    validationMessage,
    feeFormatted,
    isLoadingSubmitResult,
    feeError,
    feeLoading,
    submitWaitResultError,
    debouncedFormValues,
    isSufficientBalance,
    getFee,
    submitWaitResult,
  };
};
