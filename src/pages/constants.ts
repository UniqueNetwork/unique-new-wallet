import { FormError } from '@app/types/form';

export const _10MB = 10000000;
export const MAX_NAME_SIZE = 64;
export const MAX_DESCRIPTION_SIZE = 256;
export const MAX_SYMBOL_SIZE = 4;
export const MAX_SYMBOL_BYTES_SIZE = 16;
export const FILE_SIZE_LIMIT_ERROR = 'File size more than 10MB';
export const NO_BALANCE_MESSAGE = 'Insufficient funds. Please top up\u00a0your balance';
export const DEFAULT_POSITION_TOOLTIP = {
  appearance: 'horizontal',
  horizontal: 'right',
  vertical: 'top',
} as const;

export const FORM_ERRORS: FormError = {
  INVALID_ADDRESS: 'Please enter a valid address',
  REQUIRED_FIELDS: 'You did not fill in the required fields',
  INSUFFICIENT_BALANCE: "You don't have enough currency",
};
