import { QueriesResults, useQueries } from 'react-query';
import { AllBalancesResponse, Sdk } from '@unique-nft/sdk';
import { Address } from '@unique-nft/utils';
import { useCallback } from 'react';

import { calculateSliceBalance } from './utils';
import { queryKeys } from '../keysConfig';

export const useAccountWithdrawableBalancesService = (
  chainsUrl: string[],
  address?: string,
): { results: QueriesResults<AllBalancesResponse[]>; refetchAll(): void } => {
  const results: QueriesResults<AllBalancesResponse[]> = useQueries<
    AllBalancesResponse[]
  >(
    chainsUrl.map((baseUrl) => {
      return {
        queryKey: queryKeys.account.withdraw(`${baseUrl}-${address}`),
        queryFn: async () => {
          if (!address || !Address.is.substrateAddress(address)) {
            return Promise.resolve(undefined);
          }
          try {
            const api = new Sdk({ baseUrl, signer: null });

            const balance = await api.balance.get({
              address: Address.mirror.substrateToEthereum(address),
            });

            return Promise.resolve(calculateSliceBalance(balance));
          } catch (e) {
            return Promise.reject(e);
          }
        },
        enabled: chainsUrl.length !== 0 && !!address,
        refetchOnMount: 'always',
      };
    }),
  );

  const refetchAll = useCallback(() => {
    results.forEach((result) => result.refetch());
  }, [results]);

  return {
    results,
    refetchAll,
  };
};
