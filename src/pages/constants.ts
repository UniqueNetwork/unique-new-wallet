import { FormError } from '@app/types/form';

export const _10MB = 10000000;
export const MAX_NAME_SIZE = 64;
export const MAX_DESCRIPTION_SIZE = 256;
export const MAX_SYMBOL_SIZE = 4;
export const MAX_SYMBOL_BYTES_SIZE = 16;
export const FILE_SIZE_LIMIT_ERROR = 'File size more than 10MB';
export const FILE_FORMAT_ERROR = 'Invalid file format';
export const DEFAULT_POSITION_TOOLTIP = {
  appearance: 'horizontal',
  horizontal: 'right',
  vertical: 'top',
} as const;

export const FORM_ERRORS: FormError = {
  INVALID_ADDRESS: 'Please enter a valid address',
  REQUIRED_FIELDS: 'You did not fill in the required fields',
  INSUFFICIENT_BALANCE: "You don't have enough ",
  INVALID_AMOUNT: 'Amount must be a positive number greater than zero',
};

export const USER_HAS_NO_COLLECTION = 'First you need to create collection';

export const maxTokenLimit = 4294967295;
