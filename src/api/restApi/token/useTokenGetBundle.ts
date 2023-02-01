import { useQuery, UseQueryResult } from 'react-query';
import { GetBundleResponse, NestedToken } from '@unique-nft/sdk';
import { useMemo } from 'react';

import { useApi } from '@app/hooks';

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

  const {
    data,
    isLoading: isLoadingBundleToken,
    refetch: refetchBundle,
  }: UseQueryResult<
    GetBundleResponse & { collectionName: string; name: string }
  > = useQuery(queryKeys.token.bundle(collectionId, tokenId), () => getBundle(), {
    enabled: !!collectionId || !!tokenId,
    refetchOnMount: true,
  });

  const bundleToken = useMemo(() => {
    if (!data) {
      return undefined;
    }
    const setParent = (parent: NestedToken) => {
      parent.nestingChildTokens = parent.nestingChildTokens?.map((child) => ({
        ...setParent(child),
        nestingParentToken: {
          collectionId: parent.collectionId,
          tokenId: parent.tokenId,
        },
      }));
      return parent;
    };
    return setParent(data);
  }, [data]);

  return {
    bundleToken,
    isLoadingBundleToken,
    refetchBundle,
  };
};
