import { useEffect } from 'react';

import { useExtrinsicCacheEntities } from '@app/api';
import { Token } from '@app/api/graphQL/types';
import { useGraphQlCheckInExistTokensByAccount } from '@app/api/graphQL/tokens/useGraphQlCheckInExistTokensByAccount';

export const useCheckExistTokensByAccount = ({
  collectionId,
  tokens,
}: {
  collectionId?: number;
  tokens: Token[];
}) => {
  const { tokens: cacheTokens, excludeTokensCache } = useExtrinsicCacheEntities();

  const { synchronizedTokensIds, refetchSynchronizedTokens } =
    useGraphQlCheckInExistTokensByAccount({
      tokens: cacheTokens,
      collectionId,
    });

  useEffect(() => {
    if (synchronizedTokensIds.length > 0) {
      excludeTokensCache(synchronizedTokensIds);
    }
  }, [tokens, excludeTokensCache, synchronizedTokensIds]);

  useEffect(() => {
    if (cacheTokens.length === 0) {
      return;
    }
    refetchSynchronizedTokens();
  }, [cacheTokens, refetchSynchronizedTokens, tokens]);

  return {
    cacheTokens: Number.isInteger(collectionId)
      ? cacheTokens.filter((token) => token.collectionId === collectionId)
      : cacheTokens,
  };
};
