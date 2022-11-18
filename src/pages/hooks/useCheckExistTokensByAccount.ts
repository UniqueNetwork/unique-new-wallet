import { useEffect } from 'react';

import { useExtrinsicCacheEntities } from '@app/api';
import { Token } from '@app/api/graphQL/types';
import { useGraphQlCheckInExistTokensByAccount } from '@app/api/graphQL/tokens/useGraphQlCheckInExistTokensByAccount';
import { useTimer } from '@app/hooks';

export const useCheckExistTokensByAccount = ({
  collectionId,
  tokens,
  refetchTokens,
}: {
  collectionId?: number;
  tokens: Token[];
  refetchTokens(): void;
}) => {
  const { tokens: cacheTokens, excludeTokensCache } = useExtrinsicCacheEntities();
  const { time, setTime } = useTimer(10);

  const { synchronizedTokensIds, refetchCheckInExistTokensByAccount } =
    useGraphQlCheckInExistTokensByAccount({
      tokens: cacheTokens,
      collectionId,
      skip: [cacheTokens.length, tokens.length].includes(0),
    });

  useEffect(() => {
    if (time === 0 && cacheTokens.length > 0) {
      setTime(10);
      refetchCheckInExistTokensByAccount().then((res) => {
        (res.data?.tokens?.data?.length || 0) > 0 && refetchTokens();
      });
    }
  }, [
    cacheTokens.length,
    refetchCheckInExistTokensByAccount,
    refetchTokens,
    setTime,
    time,
  ]);

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
