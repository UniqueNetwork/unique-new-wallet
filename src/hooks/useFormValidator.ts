import { useEffect } from 'react';
import { FieldError, FieldErrorsImpl, useFormContext, useWatch } from 'react-hook-form';

import { useAccounts, useIsSufficientBalance } from '@app/hooks';
import { FORM_ERRORS } from '@app/pages';

const joinSeparator = '\n';

type FormValidatorConfig = {
  watchedFields?: string[];
  balanceValidationEnabled?: boolean;
  cost: Array<string | undefined | null>;
  address?: string;
};

export const useFormValidator = (
  config: FormValidatorConfig = {
    balanceValidationEnabled: false,
    cost: [],
  },
) => {
  const { watchedFields, balanceValidationEnabled, cost, address } = config;

  const { selectedAccount } = useAccounts();
  const isSufficientBalance = useIsSufficientBalance(
    address ?? selectedAccount?.address,
    ...cost,
  );

  const {
    trigger,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useFormContext();
  const formValues = useWatch({ name: watchedFields } as any);

  useEffect(() => clearErrors(), [watchedFields]);

  useEffect(() => {
    trigger(watchedFields);
  }, [formValues, watchedFields]);

  useEffect(() => {
    if (!balanceValidationEnabled || isSufficientBalance === null) {
      return;
    }

    isSufficientBalance
      ? clearErrors('balance')
      : setError('balance', {
          type: 'custom',
          message: `${FORM_ERRORS.INSUFFICIENT_BALANCE}${selectedAccount?.balance?.availableBalance.unit}`,
        });
  }, [isSufficientBalance, balanceValidationEnabled]);

  const errorMessage = (Object.values(errors).flat(2) as (FieldError | undefined)[])
    .reduce<FieldError[]>((arr, item) => {
      if (item && !arr.find(({ type }) => type === item.type)) {
        arr.push(item);
      }
      return arr;
    }, [])
    .map(({ message }) => message)
    .join(joinSeparator);

  const showFee = Object.keys(errors).filter((item) => item !== 'balance').length === 0;

  return { errorMessage, isValid, showFee };
};
