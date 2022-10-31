import { useEffect, useReducer } from 'react';
import { useFormContext } from 'react-hook-form';

import { useAccounts, useIsSufficientBalance } from '@app/hooks';

import { CollectionForm } from '../../types';
import { useFeeContext } from '../../context';

type ValidationActionType = 'ADD_ERROR' | 'CLEAR_ERROR';
type ErrorKey = 'REQUIRED_FIELDS' | 'INSUFFICIENT_BALANCE';

type Error = Record<ErrorKey, string>;

type ValidationState = {
  isValid: boolean;
  errors: Error;
};

type ValidationAction = {
  type: ValidationActionType;
  errorKey: ErrorKey;
};

const errorsList: Error = {
  REQUIRED_FIELDS: 'You did not fill in the required fields',
  INSUFFICIENT_BALANCE: "You don't have enough currency",
};

const reducer = (state: ValidationState, action: ValidationAction): ValidationState => {
  const actions: Record<ValidationActionType, ValidationState> = {
    ADD_ERROR: {
      isValid: false,
      errors: {
        ...state.errors,
        [action.errorKey]: errorsList[action.errorKey],
      },
    },
    CLEAR_ERROR: {
      isValid: !Object.keys(state.errors).length,
      errors: (() => {
        delete state.errors[action.errorKey];

        return state.errors;
      })(),
    },
  };

  return actions[action.type];
};

export const useNftAttributesValidator = () => {
  const [errors, setErrors] = useReducer(reducer, {
    isValid: false,
    errors: {},
  } as ValidationState);

  const {
    formState: { isValid },
  } = useFormContext<CollectionForm>();

  const { selectedAccount } = useAccounts();
  const { fee } = useFeeContext();
  const isSufficientBalance = useIsSufficientBalance(selectedAccount?.address, fee);

  useEffect(() => {
    setErrors({
      type: !isValid ? 'ADD_ERROR' : 'CLEAR_ERROR',
      errorKey: 'REQUIRED_FIELDS',
    });
  }, [isValid]);

  useEffect(() => {
    if (!isSufficientBalance && fee) {
      setErrors({
        type: 'ADD_ERROR',
        errorKey: 'INSUFFICIENT_BALANCE',
      });
    } else if (isSufficientBalance) {
      setErrors({
        type: 'CLEAR_ERROR',
        errorKey: 'INSUFFICIENT_BALANCE',
      });
    }
  }, [isSufficientBalance, fee]);

  return errors;
};
