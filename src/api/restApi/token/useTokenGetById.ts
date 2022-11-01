import { useQuery, UseQueryResult } from 'react-query';
import { TokenByIdResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { queryKeys } from '../keysConfig';

export const useTokenGetById = ({
  collectionId,
  tokenId,
}: {
  collectionId?: number;
  tokenId?: number;
}): UseQueryResult<TokenByIdResponse> => {
  const { api } = useApi();

  return useQuery(
    queryKeys.token.byId(collectionId, tokenId),
    () => api.tokens.get({ collectionId: collectionId!, tokenId: tokenId! }),
    {
      enabled: !!collectionId || !!tokenId,
      refetchOnMount: true,
    },
  );
};
