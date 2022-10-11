import { QueriesResults, useQueries } from 'react-query';
import { AllBalancesResponse, Sdk } from '@unique-nft/sdk';

import { calculateSliceBalance } from './utils';

// Запрос по всем чейнам баланса для выбранного аккаунта
export const useAccountBalancesService = (
  chainsUrl: string[],
  address?: string,
): QueriesResults<AllBalancesResponse[]> => {
  return useQueries<AllBalancesResponse[]>(
    chainsUrl.map((baseUrl) => {
      return {
        queryKey: ['account', 'chain', 'balance', baseUrl],
        queryFn: async () => {
          try {
            const api = new Sdk({ baseUrl, signer: null });
            const balance = await api.balance.get({ address: address! });
            return Promise.resolve(calculateSliceBalance(balance));
          } catch (e) {
            return Promise.reject(e);
          }
        },
        enabled: chainsUrl.length !== 0 || !address,
        refetchOnMount: 'always',
      };
    }),
  );
};
