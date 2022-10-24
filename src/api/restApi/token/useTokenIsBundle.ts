import { useQuery, UseQueryResult } from 'react-query';
import { IsBundleResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { queryKeys } from '../keysConfig';

export const useTokenIsBundle = ({
  collectionId,
  tokenId,
}: {
  collectionId?: number;
  tokenId?: number;
}): UseQueryResult<IsBundleResponse> => {
  const { api } = useApi();

  return useQuery(
    queryKeys.token.isBundle(collectionId, tokenId),
    () => api.tokens.isBundle({ collectionId: collectionId!, tokenId: tokenId! }),
    {
      enabled: !!collectionId || !!tokenId,
    },
  );
};
