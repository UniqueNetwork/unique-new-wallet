import { QueryKey, UseQueryResult } from 'react-query';

import { BalanceResponse } from '@app/types/Api';

import { useApiQuery } from '../../hooks';
import { AccountApiService } from '../AccountApiService';

export const useAccountBalanceService = (
  address?: string,
  networkURL?: string,
): UseQueryResult<BalanceResponse> =>
  useApiQuery({
    baseURL: networkURL,
    endpoint: AccountApiService.balanceQuery,
    payload: {
      address: address!,
    },
    options: {
      enabled: !!address,
    },
  });
