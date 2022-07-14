import { QueryKey } from 'react-query';

import { AllBalancesResponse } from '@app/types/Api';
import { IBaseApi, TCalculateSliceBalance } from '@app/api';

import { EndpointQuery } from '../../request';

interface RequestArgs {
  addresses: string[];
}

export class AccountsBalanceQuery extends EndpointQuery<
  AllBalancesResponse[],
  RequestArgs
> {
  protected baseUrl;

  constructor(private readonly sliceBalance: TCalculateSliceBalance) {
    super();

    this.baseUrl = '/balance';
  }

  getKey({ addresses }: RequestArgs): QueryKey {
    return ['account', 'balances', ...addresses];
  }

  request(api: IBaseApi, { addresses }: RequestArgs): Promise<AllBalancesResponse[]> {
    return Promise.all(
      addresses.map((address) =>
        api.get<AllBalancesResponse>(`${this.baseUrl}?address=${address}`),
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
