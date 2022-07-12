import { useQueryClient, UseQueryResult } from 'react-query';

import { useApiQuery, ExtrinsicApiService } from '@app/api';
import { useApi } from '@app/hooks';
import { ExtrinsicResultResponse } from '@app/types';

export const useExtrinsicStatus = (
  hash?: string | null,
): UseQueryResult<ExtrinsicResultResponse> => {
  const { api } = useApi();
  const queryClient = useQueryClient();

  return useApiQuery({
    baseURL: api?.baseURL,
    endpoint: ExtrinsicApiService.statusQuery,
    payload: {
      hash: hash!,
    },
    options: {
      enabled: !!hash,
      refetchInterval: 3000,
      onSuccess: (data) => {
        const { isCompleted, isError } = data;

        if (isCompleted && !isError) {
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey.includes('balance'),
          });
        }
      },
    },
  });
};
