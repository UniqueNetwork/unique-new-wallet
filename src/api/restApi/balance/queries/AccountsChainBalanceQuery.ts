import { QueryKey } from 'react-query';

import { AllBalancesResponse } from '@app/types/Api';
import { IBaseApi, TCalculateSliceBalance } from '@app/api';

import { EndpointQuery } from '../../request';

export interface AccountsChainBalanceQueryRequest {
  chainsUrl: string[];
  address?: string;
}

export class AccountsChainBalanceQuery extends EndpointQuery<
  AllBalancesResponse[],
  AccountsChainBalanceQueryRequest
> {
  constructor(private readonly sliceBalance: TCalculateSliceBalance) {
    super();
  }

  getKey({ chainsUrl, address }: AccountsChainBalanceQueryRequest): QueryKey {
    return ['account', 'chain', 'balances', ...chainsUrl];
  }

  request(
    api: IBaseApi,
    { chainsUrl, address }: AccountsChainBalanceQueryRequest,
  ): Promise<AllBalancesResponse[]> {
    return Promise.all(
      chainsUrl.map((baseUrl) =>
        api.get<AllBalancesResponse>(`${baseUrl}balance?address=${address}`),
      ),
    )
      .then((res) => {
        res.forEach((balance) => {
          this.sliceBalance(balance);
        });
        return Promise.resolve(res);
      })
      .catch(Promise.reject);
  }
}
