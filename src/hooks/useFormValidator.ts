import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { useAccounts, useIsSufficientBalance } from '@app/hooks';
import { FORM_ERRORS } from '@app/pages';

const joinSeparator = '. ';

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
  console.log(cost);

  const { selectedAccount } = useAccounts();
  const isSufficientBalance = useIsSufficientBalance(
    address ?? selectedAccount?.address,
    ...cost,
  );

  const {
    trigger,
    setError,
    clearErrors,
    formState: { errors },
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

    console.log(isSufficientBalance);

    isSufficientBalance
      ? clearErrors('balance')
      : setError('balance', {
          type: 'custom',
          message: FORM_ERRORS.INSUFFICIENT_BALANCE,
        });
  }, [isSufficientBalance, balanceValidationEnabled]);

  console.log(errors);

  const errorMessage = Object.values(errors)
    .map((err) => err?.message ?? '')
    .filter((err, index, arr) => arr.indexOf(err) === index)
    .sort()
    .join(joinSeparator);

  return { errorMessage, isValid: !Object.keys(errors).length };
};
