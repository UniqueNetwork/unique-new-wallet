import { UseQueryResult } from 'react-query';

import { useApiQuery, ExtrinsicApiService } from '@app/api';
import { useApi } from '@app/hooks';
import { ExtrinsicResultResponse } from '@app/types';

export const useExtrinsicStatus = (
  hash?: string,
): UseQueryResult<ExtrinsicResultResponse> => {
  const { api } = useApi();
  return useApiQuery({
    baseURL: api?.baseURL,
    endpoint: ExtrinsicApiService.statusQuery,
    payload: {
      hash: hash!,
    },
    options: {
      enabled: !!hash,
      refetchInterval: 1000,
    },
  });
};
