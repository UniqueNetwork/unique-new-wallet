import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { QueryOptions, QueryResponse, RftFraction, Token } from '@app/api/graphQL/types';

const OWNER_TOKENS_QUERY = gql`
  query token_owners_query($where: TokenOwnersWhereParams, $offset: Int, $limit: Int) {
    token_owners(where: $where, offset: $offset, limit: $limit) {
      count
      data {
        collection_id
        token_id
        id
        amount
        owner
      }
    }
  }
`;

export const useGraphQlGetRftFractionsByOwner = (
  owner: string | undefined,
  tokens: { token_id: number; collection_id: number }[],
) => {
  const where = useMemo(() => {
    let where: { [key: string]: unknown } = {
      owner: { _eq: owner },
    };

    if (!tokens.length) {
      return where;
    }

    const collectionMap = new Map();
    tokens.forEach((token) => {
      const tokensInCollectionMap = collectionMap.get(token.collection_id);

      if (tokensInCollectionMap) {
        collectionMap.set(token.collection_id, [
          ...tokensInCollectionMap,
          token.token_id,
        ]);
      } else {
        collectionMap.set(token.collection_id, [token.token_id]);
      }
    });

    const tokensFilter: { [key: string]: unknown }[] = [];
    collectionMap.forEach((tokens, collectionId) => {
      tokensFilter.push({
        collection_id: { _eq: collectionId },
        token_id: { _in: tokens },
      });
    });
    where = {
      _or: tokensFilter,
      amount: { _neq: '0' },
    };

    return where;
  }, [owner, tokens]);

  const {
    data: response,
    loading,
    refetch,
    error,
  } = useQuery<QueryResponse<RftFraction>>(OWNER_TOKENS_QUERY, {
    skip: !tokens.length || !owner,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: {
      where,
    },
  });

  return {
    error,
    loading,
    refetch,
    fractions: response?.token_owners.data,
  };
};
