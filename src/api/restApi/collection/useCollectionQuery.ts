import { useQuery, UseQueryResult } from 'react-query';
import { CollectionInfoWithSchemaResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

export const useCollectionQuery = (
  collectionId?: number,
): UseQueryResult<CollectionInfoWithSchemaResponse> => {
  const { api } = useApi();

  return useQuery(
    ['collection', collectionId],
    () => api.collections.get({ collectionId: collectionId! }),
    {
      enabled: !!collectionId,
    },
  );
};
