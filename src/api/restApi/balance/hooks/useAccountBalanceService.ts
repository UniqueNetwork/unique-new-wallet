import { UseQueryResult } from 'react-query';

import { AllBalancesResponse } from '@app/types/Api';
import { useApiQuery, AccountApiService } from '@app/api';

export const useAccountBalanceService = (
  address?: string,
  networkURL?: string,
): UseQueryResult<AllBalancesResponse> =>
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
