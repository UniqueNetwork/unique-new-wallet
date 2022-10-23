import { useQuery, UseQueryResult } from 'react-query';
import { CollectionInfoWithSchemaResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { queryKeys } from '../keysConfig';

export const useCollectionGetById = (
  collectionId?: number,
): UseQueryResult<CollectionInfoWithSchemaResponse> => {
  const { api } = useApi();

  return useQuery(
    queryKeys.collection.byId(collectionId),
    () => api.collections.get({ collectionId: collectionId! }),
    {
      enabled: !!collectionId,
    },
  );
};
