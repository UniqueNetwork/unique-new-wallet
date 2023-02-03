import { useQuery, UseQueryResult } from 'react-query';
import { GetBundleResponse } from '@unique-nft/sdk';

import { useApi } from '@app/hooks';
import { INestingToken } from '@app/components/BundleTree/types';

import { queryKeys } from '../keysConfig';

export const useTokenGetBundle = ({
  collectionId,
  tokenId,
}: {
  collectionId?: number;
  tokenId?: number;
}) => {
  const { api } = useApi();

  const getBundle = async () => {
    const [bundle, collection] = await Promise.all([
      api.tokens.getBundle({ collectionId: collectionId!, tokenId: tokenId! }),
      api.collections.get({ collectionId: collectionId! }),
    ]);

    const enhance = (node: INestingToken): INestingToken => {
      return {
        ...node,
        nestingChildTokens: node.nestingChildTokens?.map((child) => ({
          ...enhance(child),
          nestingParentToken: {
            collectionId: node.collectionId,
            tokenId: node.tokenId,
          },
        })),
      };
    };

    return enhance({
      ...bundle,
      name: `${collection.tokenPrefix} #${bundle.tokenId}`,
      collectionName: collection.name,
    });
  };

  const {
    data,
    isLoading: isLoadingBundleToken,
    refetch: refetchBundle,
  }: UseQueryResult<
    GetBundleResponse & { collectionName: string; name: string }
  > = useQuery(queryKeys.token.bundle(collectionId, tokenId), getBundle, {
    enabled: !!collectionId || !!tokenId,
    refetchOnMount: true,
  });

  return {
    bundleToken: data,
    isLoadingBundleToken,
    refetchBundle,
  };
};
