export type FormErrorKey =
  | 'REQUIRED_FIELDS'
  | 'INSUFFICIENT_BALANCE'
  | 'INVALID_ADDRESS'
  | 'INVALID_AMOUNT';

export type FormError = Record<FormErrorKey, string>;
