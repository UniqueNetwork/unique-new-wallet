import { UseQueryResult } from 'react-query';

import { CollectionInfoWithPropertiesDto } from '@app/types/Api';
import { CollectionApiService, useApiQuery } from '@app/api';

export const useCollectionQuery = (
  collectionId: number,
): UseQueryResult<CollectionInfoWithPropertiesDto> =>
  useApiQuery({
    endpoint: CollectionApiService.collectionQuery,
    payload: { collectionId },
    options: {
      enabled: !!collectionId,
    },
  });
