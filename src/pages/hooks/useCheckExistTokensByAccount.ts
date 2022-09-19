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

  const { synchronizedTokensIds } = useGraphQlCheckInExistTokensByAccount({
    tokens: cacheTokens,
    collectionId,
    skip: [cacheTokens.length, tokens.length].includes(0),
  });

  useEffect(() => {
    if (synchronizedTokensIds.length > 0) {
      excludeTokensCache(synchronizedTokensIds);
    }
  }, [tokens, excludeTokensCache, synchronizedTokensIds]);

  return {
    cacheTokens: Number.isInteger(collectionId)
      ? cacheTokens.filter((token) => token.collectionId === collectionId)
      : cacheTokens,
  };
};
