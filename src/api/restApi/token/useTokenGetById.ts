import { useQuery, UseQueryResult } from 'react-query';
import { TokenByIdResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

export const useTokenGetById = ({
  collectionId,
  tokenId,
}: {
  collectionId?: number;
  tokenId?: number;
}): UseQueryResult<TokenByIdResponse & { collectionName: string; name: string }> => {
  const { api } = useApi();

  const getToken = async () => {
    const [token, collection] = await Promise.all([
      api.tokens.get({ collectionId: collectionId!, tokenId: tokenId! }),
      api.collections.get({ collectionId: collectionId! }),
    ]);
    return {
      ...token,
      name: `${collection.tokenPrefix} #${token.tokenId}`,
      collectionName: collection.name,
    };
  };

  return useQuery(['token', collectionId, tokenId], () => getToken(), {
    enabled: !!collectionId || !!collectionId,
  });
};
