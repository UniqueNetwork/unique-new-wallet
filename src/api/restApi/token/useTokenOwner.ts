import { useQuery, UseQueryResult } from 'react-query';
import { TokenOwnerResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { queryKeys } from '../keysConfig';

export const useTokenOwner = ({
  collectionId,
  tokenId,
}: {
  collectionId?: number;
  tokenId?: number;
}): UseQueryResult<TokenOwnerResponse> => {
  const { api } = useApi();

  return useQuery(
    queryKeys.token.owner(collectionId, tokenId),
    () => api.tokens.owner({ collectionId: collectionId!, tokenId: tokenId! }),
    {
      enabled: !!collectionId || !!tokenId,
      refetchOnMount: true,
    },
  );
};
