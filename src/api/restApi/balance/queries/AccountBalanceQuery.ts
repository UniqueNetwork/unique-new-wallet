import { QueryKey } from 'react-query';

import { AllBalancesResponse } from '@app/types/Api';
import { IBaseApi, TCalculateSliceBalance } from '@app/api';

import { EndpointQuery } from '../../request';

interface RequestArgs {
  address: string;
}

export class AccountBalanceQuery extends EndpointQuery<AllBalancesResponse, RequestArgs> {
  protected baseUrl;

  constructor(private readonly sliceBalance: TCalculateSliceBalance) {
    super();

    this.baseUrl = '/balance';
  }

  getKey({ address }: RequestArgs): QueryKey {
    return ['account', 'balance', address];
  }

  request(api: IBaseApi, { address }: RequestArgs): Promise<AllBalancesResponse> {
    return api
      .get<AllBalancesResponse>(`${this.baseUrl}?address=${address}`)
      .then((balance) => Promise.resolve(this.sliceBalance(balance)))
      .catch(Promise.reject);
  }
}
