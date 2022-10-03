import { useQuery, UseQueryResult } from 'react-query';
import { AllBalancesResponse, Sdk } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { calculateSliceBalance } from './utils';

export const useAccountBalanceService = (
  address?: string,
  networkURL?: string,
): UseQueryResult<AllBalancesResponse> => {
  const { api } = useApi();

  const getBalance = (address: string) => {
    const apiSdk = networkURL ? new Sdk({ baseUrl: networkURL, signer: null }) : api;

    return apiSdk.balance
      .get({ address })
      .then((balance) => Promise.resolve(calculateSliceBalance(balance)))
      .catch(Promise.reject);
  };

  return useQuery(['account', 'balance', address], () => getBalance(address!), {
    enabled: !!address,
  });
};
