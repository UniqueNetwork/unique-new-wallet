import { useQuery, UseQueryResult } from 'react-query';
import { TopmostTokenOwnerResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { queryKeys } from '../keysConfig';

export const useTokenTopmostOwner = ({
  collectionId,
  tokenId,
}: {
  collectionId?: number;
  tokenId?: number;
}): UseQueryResult<TopmostTokenOwnerResponse> => {
  const { api } = useApi();

  return useQuery(
    queryKeys.token.owner(collectionId, tokenId),
    () => api.tokens.topmostOwner({ collectionId: collectionId!, tokenId: tokenId! }),
    {
      enabled: !!collectionId || !!tokenId,
      refetchOnMount: true,
    },
  );
};
