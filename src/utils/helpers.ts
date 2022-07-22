import { Nullable } from '@app/types';

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const existValue = <T>(value: Nullable<T>): value is T => {
  const notExistedValues = ['', undefined, null] as unknown[];
  return !notExistedValues.includes(value);
};

/*
  Нам на вход приходит строка вида 123087.38808524234
  Необходимо после точки показывать только первые 4 цифры
*/
export const truncateDecimalsBalanceSheet = (balance: string) => {
  const arrBalance = balance.split('.');

  if (arrBalance.length === 1) {
    return balance;
  }
  const lastElem = arrBalance.length - 1;
  arrBalance[lastElem] = arrBalance[lastElem].slice(0, 4);
  return arrBalance.join('.');
};
