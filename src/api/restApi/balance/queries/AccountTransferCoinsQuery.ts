import { QueryKey } from 'react-query';

import { BalanceResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

import { EndpointQuery } from '../../request';

export interface RequestArgs {
  address: string;
}

export class AccountBalanceQuery extends EndpointQuery<BalanceResponse, RequestArgs> {
  protected baseUrl;

  constructor() {
    super();

    this.baseUrl = '/balance';
  }

  getKey({ address }: RequestArgs): QueryKey {
    return ['account', 'balance', address];
  }

  request(api: IBaseApi, { address }: RequestArgs): Promise<BalanceResponse> {
    return api.get<BalanceResponse>(`${this.baseUrl}?address=${address}`);
  }
}
