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

  request(api: IBaseApi, { address }: RequestArgs): Promise<AllBalancesResponse> {
    return api.get(`${this.baseUrl}?address=${address}`);
  }
}
