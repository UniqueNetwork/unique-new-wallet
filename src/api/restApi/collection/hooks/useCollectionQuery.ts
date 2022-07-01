import { UseQueryResult } from 'react-query';

import { CollectionInfoResponse } from '@app/types/Api';
import { CollectionApiService, useApiQuery } from '@app/api';

export const useCollectionQuery = (
  collectionId: number,
): UseQueryResult<CollectionInfoResponse> =>
  useApiQuery({
    endpoint: CollectionApiService.collectionQuery,
    payload: { collectionId },
    options: {
      enabled: !!collectionId,
    },
  });
