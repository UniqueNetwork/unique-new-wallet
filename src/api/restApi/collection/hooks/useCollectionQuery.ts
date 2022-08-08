import { UseQueryResult } from 'react-query';

import { CollectionApiService, useApiQuery } from '@app/api';
import { CollectionInfoWithSchemaResponse } from '@app/types/Api';

export const useCollectionQuery = (
  collectionId: number,
): UseQueryResult<CollectionInfoWithSchemaResponse> =>
  useApiQuery({
    endpoint: CollectionApiService.collectionQuery,
    payload: { collectionId },
    options: {
      enabled: !!collectionId,
    },
  });
