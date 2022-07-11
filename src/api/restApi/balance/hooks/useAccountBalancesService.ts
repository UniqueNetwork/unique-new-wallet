import { UseQueryResult } from 'react-query';

import { AllBalancesResponse } from '@app/types/Api';
import { useApiQuery, AccountApiService } from '@app/api';

// Запрос по всем чейнам баланса для выбранного аккаунта
export const useAccountBalancesService = (
  chainsUrl: string[],
  address?: string,
): UseQueryResult<AllBalancesResponse[]> =>
  useApiQuery({
    endpoint: AccountApiService.chainBalancesQuery,
    payload: {
      chainsUrl,
      address,
    },
    options: {
      enabled: chainsUrl.length !== 0 || !address,
      refetchOnMount: 'always',
    },
  });
