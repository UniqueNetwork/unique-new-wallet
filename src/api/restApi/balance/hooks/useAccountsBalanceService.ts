import { UseQueryResult } from 'react-query';

import { AllBalancesResponse } from '@app/types/Api';
import { useApiQuery, AccountApiService } from '@app/api';

export const useAccountsBalanceService = (
  addresses: string[],
): UseQueryResult<AllBalancesResponse[]> =>
  useApiQuery({
    endpoint: AccountApiService.balancesQuery,
    payload: {
      addresses,
    },
    options: {
      enabled: addresses.length !== 0,
      refetchOnMount: 'always',
    },
  });
