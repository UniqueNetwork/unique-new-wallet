import { UseQueryResult } from 'react-query';

import { ChainPropertiesResponse } from '@app/types/Api';
import { CollectionApiService } from '@app/api';

import { useApiQuery } from '../../hooks';

export const useCollectionQuery = (
  collectionId: number,
): UseQueryResult<ChainPropertiesResponse> =>
  useApiQuery({
    endpoint: CollectionApiService.collectionQuery,
    payload: { collectionId },
    options: {
      enabled: !!collectionId,
    },
  });
