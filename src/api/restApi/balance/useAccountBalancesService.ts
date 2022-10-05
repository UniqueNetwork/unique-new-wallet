import { useQuery, UseQueryResult } from 'react-query';
import { AllBalancesResponse, Sdk } from '@unique-nft/sdk';

import { calculateSliceBalance } from './utils';

// Запрос по всем чейнам баланса для выбранного аккаунта
export const useAccountBalancesService = (
  chainsUrl: string[],
  address?: string,
): UseQueryResult<AllBalancesResponse[]> => {
  const getAccountBalances = (address: string) => {
    return Promise.all(
      chainsUrl.map((baseUrl) => {
        const api = new Sdk({ baseUrl, signer: null });
        return api.balance.get({ address });
      }),
    )
      .then((res) => {
        res.forEach((balance) => {
          calculateSliceBalance(balance);
        });
        return Promise.resolve(res);
      })
      .catch(Promise.reject);
  };

  return useQuery(
    ['account', 'chain', 'balances', ...chainsUrl],
    () => getAccountBalances(address!),
    {
      enabled: chainsUrl.length !== 0 || !address,
      refetchOnMount: 'always',
    },
  );
};
