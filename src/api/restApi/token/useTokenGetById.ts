import { useQuery, UseQueryResult } from 'react-query';
import { TokenByIdResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

export const useTokenGetById = ({
  collectionId,
  tokenId,
}: {
  collectionId?: number;
  tokenId?: number;
}): UseQueryResult<TokenByIdResponse> => {
  const { api } = useApi();

  return useQuery(
    ['token', collectionId, tokenId],
    () => api.tokens.get({ collectionId: collectionId!, tokenId: tokenId! }),
    {
      enabled: !!collectionId || !!tokenId,
    },
  );
};
