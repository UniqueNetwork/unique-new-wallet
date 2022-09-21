import { useCallback, useEffect } from 'react';
import { makeVar, useReactiveVar } from '@apollo/client';

import { TCollectionsCacheVar, TExtrinsicType, TTokensCacheVar } from '@app/api';
import { Token } from '@app/api/graphQL/types';

const CACHE_COLLECTIONS_STORAGE_KEY = 'wallet_cache_collections';
const CACHE_TOKENS_STORAGE_KEY = 'wallet_cache_tokens';

const collectionsVar = makeVar<TCollectionsCacheVar>(
  JSON.parse(
    localStorage.getItem(CACHE_COLLECTIONS_STORAGE_KEY) || '[]',
  ) as TCollectionsCacheVar,
);

const tokensVar = makeVar<TTokensCacheVar>(
  JSON.parse(localStorage.getItem(CACHE_TOKENS_STORAGE_KEY) || '[]') as TTokensCacheVar,
);

type TConcreteExtrinsic = Partial<
  Record<TExtrinsicType, (data: TPayloadData) => TCollectionsCacheVar | TTokensCacheVar>
>;

type TPayloadData = {
  entityData: any;
  parsed: any;
  type: keyof TConcreteExtrinsic;
};

const cacheEntities: TConcreteExtrinsic = {
  'create-collection': ({ entityData, parsed }) => {
    const currentData = collectionsVar();

    if (parsed.collectionId === undefined) {
      return currentData;
    }

    return collectionsVar([
      ...currentData,
      {
        collectionId: parsed.collectionId,
        path: entityData.schema?.coverPicture?.ipfsCid,
      },
    ]);
  },
  'create-token': ({ entityData, parsed }) => {
    const currentData = tokensVar();

    if (parsed.tokenId === undefined) {
      return currentData;
    }

    return tokensVar([
      ...currentData,
      {
        tokenId: parsed.tokenId,
        collectionId: parsed.collectionId,
        path: entityData.data?.image?.ipfsCid,
      },
    ]);
  },
};

export const useExtrinsicCacheEntities = () => {
  const collections = useReactiveVar(collectionsVar);
  const tokens = useReactiveVar(tokensVar);

  useEffect(() => {
    localStorage.setItem(CACHE_COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    localStorage.setItem(CACHE_TOKENS_STORAGE_KEY, JSON.stringify(tokens));
  }, [tokens]);

  const setPayloadEntity = (data: TPayloadData) => {
    const reactiveEntitiesFn = cacheEntities[data.type];
    if (!reactiveEntitiesFn) {
      return;
    }
    reactiveEntitiesFn(data);
  };

  const excludeTokensCache = useCallback(
    (data: Pick<Token, 'token_id' | 'collection_id'>[]) => {
      const currentTokensCache = tokensVar();

      const updateTokens = currentTokensCache.filter(
        ({ tokenId, collectionId }) =>
          !data.some(
            ({ token_id, collection_id }) =>
              token_id === tokenId && collection_id === collectionId,
          ),
      );
      tokensVar(updateTokens);
    },
    [],
  );

  const excludeCollectionsCache = useCallback((ids: number | number[]) => {
    const excludedIds = Array.isArray(ids) ? ids : [ids];
    const currentCollectionCache = collectionsVar();

    const updateTokens = currentCollectionCache.filter(
      ({ collectionId }) => !excludedIds.includes(collectionId),
    );
    collectionsVar(updateTokens);
  }, []);

  return {
    setPayloadEntity,
    collections,
    tokens,
    excludeTokensCache,
    excludeCollectionsCache,
  };
};
