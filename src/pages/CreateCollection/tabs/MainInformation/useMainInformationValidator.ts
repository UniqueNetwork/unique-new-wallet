import React, { useReducer, useEffect } from 'react';
import { useWatch } from 'react-hook-form';

import { CollectionForm } from '../../types';

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

// this hook is a temporal solution
// and will be rewritten on kind of form factory as an universal template

export const useMainInformationValidator = () => {
  const [errors, setErrors] = useReducer(reducer, {
    isValid: false,
    errors: {},
  } as ValidationState);
  const [name, symbol] = useWatch<CollectionForm>({ name: ['name', 'symbol'] });

  useEffect(() => {
    setErrors({
      type: !name || !symbol ? 'ADD_ERROR' : 'CLEAR_ERROR',
      errorKey: 'REQUIRED_FIELDS',
    });
  }, [name, symbol]);

  return errors;
};
