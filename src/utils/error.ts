import { AxiosError } from 'axios';

export const isAxiosError = (e: unknown): e is AxiosError => {
  return Object.hasOwn(e as AxiosError, 'response');
};

export const isNativeError = (e: unknown): e is Error => {
  return Object.hasOwn(e as Error, 'message');
};
