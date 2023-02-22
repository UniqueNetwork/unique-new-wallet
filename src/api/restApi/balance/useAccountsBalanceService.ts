import { QueriesResults, useQueries } from 'react-query';
import { AllBalancesResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { calculateSliceBalance } from './utils';
import { queryKeys } from '../keysConfig';

export const useAccountsBalanceService = (
  addresses: string[],
): QueriesResults<AllBalancesResponse[]> => {
  const { api } = useApi();

  return useQueries<AllBalancesResponse[]>(
    addresses.map((address) => {
      return {
        queryKey: queryKeys.account.balance(address),
        queryFn: async () => {
          try {
            const balance = await api.balance.get({ address });
            return Promise.resolve(calculateSliceBalance(balance));
          } catch (e) {
            return Promise.reject(e);
          }
        },
        enabled: addresses.length !== 0,
        refetchOnMount: 'always',
      };
    }),
  );
};
