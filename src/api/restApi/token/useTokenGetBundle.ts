import { useQuery, UseQueryResult } from 'react-query';
import { GetBundleResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';

export const useTokenGetBundle = ({
  collectionId,
  tokenId,
}: {
  collectionId?: number;
  tokenId?: number;
}): UseQueryResult<GetBundleResponse & { collectionName: string; name: string }> => {
  const { api } = useApi();

  const getBundle = async () => {
    const [token, collection] = await Promise.all([
      api.tokens.getBundle({ collectionId: collectionId!, tokenId: tokenId! }),
      api.collections.get({ collectionId: collectionId! }),
    ]);
    return {
      ...token,
      name: `${collection.tokenPrefix} #${token.tokenId}`,
      collectionName: collection.name,
    };
  };

  return useQuery(['token', 'get-bundle', collectionId, tokenId], () => getBundle(), {
    enabled: !!collectionId || !!collectionId,
  });
};
