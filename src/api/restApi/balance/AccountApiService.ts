import { AllBalancesResponse } from '@app/types/Api';
import { truncateDecimalsBalanceSheet } from '@app/utils';

import { AccountBalanceTransferMutation } from './mutations/AccountBalanceTransferMutation';
import { AccountBalanceQuery } from './queries/AccountBalanceQuery';
import { AccountsBalanceQuery } from './queries/AccountsBalanceQuery';
import { AccountsChainBalanceQuery } from './queries/AccountsChainBalanceQuery';

export type TCalculateSliceBalance = (
  balance: AllBalancesResponse,
) => AllBalancesResponse;

export class AccountApiService {
  private static calculateSliceBalance = (balance: AllBalancesResponse) => {
    const keys = Object.keys(balance) as (keyof AllBalancesResponse)[];

    keys.forEach((property) => {
      balance[property].amount = truncateDecimalsBalanceSheet(balance[property].amount);
    });
    return balance;
  };

  static balanceQuery = new AccountBalanceQuery(this.calculateSliceBalance);
  static balancesQuery = new AccountsBalanceQuery(this.calculateSliceBalance);
  static chainBalancesQuery = new AccountsChainBalanceQuery(this.calculateSliceBalance);
  static balanceTransfer = new AccountBalanceTransferMutation();
}
