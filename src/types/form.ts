export type FormErrorKey = 'REQUIRED_FIELDS' | 'INSUFFICIENT_BALANCE' | 'INVALID_ADDRESS';

export type FormError = Record<FormErrorKey, string>;
