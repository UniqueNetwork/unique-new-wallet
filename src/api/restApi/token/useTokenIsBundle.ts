import { useQuery, UseQueryResult } from 'react-query';
import { IsBundleResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

export const useTokenIsBundle = ({
  collectionId,
  tokenId,
}: {
  collectionId?: number;
  tokenId?: number;
}): UseQueryResult<IsBundleResponse> => {
  const { api } = useApi();

  return useQuery(
    ['token', 'is-bundle', collectionId, tokenId],
    () => api.tokens.isBundle({ collectionId: collectionId!, tokenId: tokenId! }),
    {
      enabled: !!collectionId || !!tokenId,
    },
  );
};
