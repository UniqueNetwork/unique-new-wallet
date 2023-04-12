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
export const truncateDecimalsBalanceSheet = (balance: string | undefined) => {
  if (!balance) {
    return '0';
  }
  const arrBalance = balance.split('.');

  if (arrBalance.length === 1) {
    return balance;
  }
  const lastElem = arrBalance.length - 1;
  arrBalance[lastElem] = arrBalance[lastElem].slice(0, 4);
  return arrBalance.join('.');
};

export const isTouchDevice = 'ontouchstart' in document.documentElement;

export const setUrlParameters = (() => {
  let delayId: NodeJS.Timeout | undefined;

  return (parameters: Record<string, string>) => {
    const searchParams = new URLSearchParams(window.location.search);

    Object.keys(parameters).forEach((parameter) => {
      searchParams.set(parameter, parameters[parameter]);
    });
    if (delayId) {
      clearTimeout(delayId);
    }
    delayId = setTimeout(() => {
      // eslint-disable-next-line no-restricted-globals
      history.pushState(
        null,
        '',
        `${window.location.pathname}?${searchParams.toString()}`,
      );
    }, 100);
  };
})();

export const parseFilterState = (value: string | null) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch (e) {
    return null;
  }
};
