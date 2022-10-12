import { AllBalancesResponse } from '@app/types/Api';
import { truncateDecimalsBalanceSheet } from '@app/utils';

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
