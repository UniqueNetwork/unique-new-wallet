import { useQuery, UseQueryResult } from 'react-query';
import { AllBalancesResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { calculateSliceBalance } from './utils';

export const useAccountsBalanceService = (
  addresses: string[],
): UseQueryResult<AllBalancesResponse[]> => {
  const { api } = useApi();
  const getAccountsBalance = (addresses: string[]) => {
    return Promise.all(addresses.map((address) => api.balance.get({ address })))
      .then((res) => {
        res.forEach((balance) => {
          calculateSliceBalance(balance);
        });
        return Promise.resolve(res);
      })
      .catch(Promise.reject);
  };

  return useQuery(
    ['account', 'balances', ...addresses],
    () => getAccountsBalance(addresses),
    {
      enabled: addresses.length !== 0,
      refetchOnMount: 'always',
    },
  );
};
