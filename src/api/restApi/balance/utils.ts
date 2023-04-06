import { AllBalancesResponse } from '@app/types/Api';
import { sleep, truncateDecimalsBalanceSheet } from '@app/utils';

export const calculateSliceBalance = (balance: AllBalancesResponse) => {
  const balances = {
    availableBalance: { ...balance.availableBalance },
    freeBalance: { ...balance.freeBalance },
    lockedBalance: { ...balance.lockedBalance },
  };
  const keys = Object.keys(balances) as (keyof typeof balances)[];

  keys.forEach((property) => {
    balance[property].amount = truncateDecimalsBalanceSheet(balance[property].amount);
  });
  return balance;
};

export const repeatCheckForTransactionFinish = async (
  checkIfCompleted: () => Promise<boolean>,
  options: { maxAttempts: boolean; awaitBetweenAttempts: number } | null = null,
): Promise<void> => {
  let attempt = 0;
  const maxAttempts = options?.maxAttempts || 100;
  const awaitBetweenAttempts = options?.awaitBetweenAttempts || 2 * 1000;

  while (attempt < maxAttempts) {
    const isCompleted = await checkIfCompleted();
    if (isCompleted) {
      return;
    }
    attempt++;
    await sleep(awaitBetweenAttempts);
  }

  throw new Error('Awaiting tx execution timed out');
};

export const amountToBnString = (value: string, decimals: number): string => {
  if (!value || !value.length) {
    return '0';
  }

  const numStringValue = value.replace(',', '.');
  const [left, right] = numStringValue.split('.');
  const decimalsFromLessZeroString = right?.length || 0;
  const bigValue = [...(left || []), ...(right || [])].join('').replace(/^0+/, '');
  return (
    Number(bigValue) * Math.pow(10, decimals - decimalsFromLessZeroString)
  ).toString();
};
