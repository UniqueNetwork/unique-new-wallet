import { useQuery, UseQueryResult } from 'react-query';
import { TokenParentResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { queryKeys } from '../keysConfig';

export const useTokenParentGetById = ({
  collectionId,
  tokenId,
}: {
  collectionId?: number;
  tokenId?: number;
}): UseQueryResult<TokenParentResponse> => {
  const { api } = useApi();

  return useQuery(
    queryKeys.token.parent(collectionId, tokenId),
    () => api.tokens.parent({ collectionId: collectionId!, tokenId: tokenId! }),
    {
      enabled: !!collectionId || !!tokenId,
      refetchOnMount: true,
    },
  );
};
