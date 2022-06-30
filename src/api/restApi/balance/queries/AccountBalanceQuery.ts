import { QueryKey } from 'react-query';

import { AllBalancesResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

import { EndpointQuery } from '../../request';

export interface RequestArgs {
  address: string;
}

export class AccountBalanceQuery extends EndpointQuery<AllBalancesResponse, RequestArgs> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/balance';
  }

  getKey({ address }: RequestArgs): QueryKey {
    return ['account', 'balance', address];
  }

  /*
    Нам на вход приходит строка вида 123087.38808524234
    Необходимо после точки показывать только первые 4 цифры
   */
  private static sliceAmount(balance: string) {
    const arrBalance = balance.split('.');

    if (arrBalance.length === 1) {
      return balance;
    }
    const lastElem = arrBalance.length - 1;
    arrBalance[lastElem] = arrBalance[lastElem].slice(0, 4);
    return arrBalance.join('.');
  }

  request(api: IBaseApi, { address }: RequestArgs): Promise<AllBalancesResponse> {
    return api
      .get<AllBalancesResponse>(`${this.baseUrl}?address=${address}`)
      .then((balance) => {
        const keys = Object.keys(balance) as (keyof AllBalancesResponse)[];

        keys.forEach((property) => {
          balance[property].amount = AccountBalanceQuery.sliceAmount(
            balance[property].amount,
          );
        });
        return Promise.resolve(balance);
      })
      .catch(Promise.reject);
  }
}
