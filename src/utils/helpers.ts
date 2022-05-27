import { Nullable } from '@app/types';

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const existValue = <T>(value: Nullable<T>): value is T => {
  const notExistedValues = ['', undefined, null] as unknown[];
  return !notExistedValues.includes(value);
};
