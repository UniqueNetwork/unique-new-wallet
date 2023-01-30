import { useQuery, UseQueryResult } from 'react-query';
import { TotalPiecesResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

import { queryKeys } from '../keysConfig';

export const useTokenGetTotalPieces = ({
  collectionId,
  tokenId,
}: {
  collectionId?: number;
  tokenId?: number;
}): UseQueryResult<TotalPiecesResponse> => {
  const { api } = useApi();

  return useQuery(
    queryKeys.token.owner(collectionId, tokenId),
    () => api.refungible.totalPieces({ collectionId: collectionId!, tokenId: tokenId! }),
    {
      enabled: !!collectionId && !!tokenId,
      refetchOnMount: true,
    },
  );
};
