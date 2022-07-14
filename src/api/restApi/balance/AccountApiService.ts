import { AllBalancesResponse } from '@app/types/Api';

import { AccountBalanceTransferMutation } from './mutations/AccountBalanceTransferMutation';
import { AccountBalanceQuery } from './queries/AccountBalanceQuery';
import { AccountsBalanceQuery } from './queries/AccountsBalanceQuery';
import { AccountsChainBalanceQuery } from './queries/AccountsChainBalanceQuery';

export type TCalculateSliceBalance = (
  balance: AllBalancesResponse,
) => AllBalancesResponse;

export class AccountApiService {
  /*
   Нам на вход приходит строка вида 123087.38808524234
   Необходимо после точки показывать только первые 4 цифры
  */
  private static truncateDecimalsBalanceSheet = (balance: string) => {
    const arrBalance = balance.split('.');

    if (arrBalance.length === 1) {
      return balance;
    }
    const lastElem = arrBalance.length - 1;
    arrBalance[lastElem] = arrBalance[lastElem].slice(0, 4);
    return arrBalance.join('.');
  };

  private static calculateSliceBalance = (balance: AllBalancesResponse) => {
    const keys = Object.keys(balance) as (keyof AllBalancesResponse)[];

    keys.forEach((property) => {
      balance[property].amount = this.truncateDecimalsBalanceSheet(
        balance[property].amount,
      );
    });
    return balance;
  };

  static balanceQuery = new AccountBalanceQuery(this.calculateSliceBalance);
  static balancesQuery = new AccountsBalanceQuery(this.calculateSliceBalance);
  static chainBalancesQuery = new AccountsChainBalanceQuery(this.calculateSliceBalance);
  static balanceTransfer = new AccountBalanceTransferMutation();
}
