import { QueriesResults, useQueries } from 'react-query';
import { AllBalancesResponse } from '@unique-nft/sdk';
import { Address } from '@unique-nft/utils';

import { useApi } from '@app/hooks';

import { calculateSliceBalance } from './utils';
import { queryKeys } from '../keysConfig';

export const useAccountsWithdrawableBalanceService = (
  addresses: string[],
): QueriesResults<AllBalancesResponse[]> => {
  const { api } = useApi();

  return useQueries<AllBalancesResponse[]>(
    addresses.map((address) => {
      return {
        queryKey: queryKeys.account.withdraw(address),
        queryFn: async () => {
          try {
            const balance = await api.balance.get({
              address: Address.mirror.substrateToEthereum(address),
            });
            return Promise.resolve(calculateSliceBalance(balance));
          } catch (e) {
            return Promise.reject(e);
          }
        },
        enabled: addresses.length !== 0 && Address.is.substrateAddressInAnyForm(address),
        refetchOnMount: 'always',
        refetchIntervalInBackground: true,
        refetchInterval: 60_000,
      };
    }),
  );
};
