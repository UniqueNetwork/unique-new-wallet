import { useQuery, UseQueryResult } from 'react-query';
import { LastTokenIdResultDto } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { queryKeys } from '../keysConfig';

export const useCollectionGetLastTokenId = (
  collectionId?: number,
): UseQueryResult<LastTokenIdResultDto> => {
  const { api } = useApi();

  return useQuery(
    queryKeys.collection.lastToken(collectionId),
    () => api.collections.lastTokenId({ collectionId: collectionId! }),
    {
      enabled: !!collectionId,
    },
  );
};
