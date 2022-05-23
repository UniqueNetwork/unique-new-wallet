import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';

import { ViewToken } from './types';

type AdditionalFilters = {
  collectionIds?: number[];
};

type Pagination = {
  defaultPage: number;
  limit: number;
};

type Direction = 'asc' | 'desc';

type Options = {
  direction?: Direction;
  pagination?: Pagination;
  skip?: boolean;
};

type AccountTokensResponse = {
  view_tokens: ViewToken[];
  view_tokens_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

const TOKENS_QUERY = gql`
  query GetGraphQlAccountTokens(
    $where: view_tokens_bool_exp
    $offset: Int
    $limit: Int
    $sort: order_by
  ) {
    view_tokens(
      where: $where
      offset: $offset
      limit: $limit
      order_by: { token_id: $sort }
    ) {
      image_path
      token_id
      token_prefix
      collection_name
      collection_id
    }
    view_tokens_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const useGraphQlAccountTokens = (
  accountAddress: string | null,
  filters: AdditionalFilters,
  options?: Options,
) => {
  const { collectionIds } = filters;
  const { direction, pagination, skip } = options ?? {
    direction: 'desc',
    skip: false,
  };
  const { defaultPage, limit } = pagination ?? { defaultPage: 0, limit: 10 };

  const [page, setPage] = useState(defaultPage);

  const {
    data: response,
    loading: tokensLoading,
    error,
  } = useQuery<AccountTokensResponse>(TOKENS_QUERY, {
    skip,
    displayName: 'TESTTEST',
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit,
      offset: limit * page,
      direction,
      where: {
        owner: {
          _eq: accountAddress,
        },
        collection_id: {
          _in: collectionIds,
        },
      },
    },
  });

  return {
    fetchPageData: (page: number): void => setPage(page),
    tokensCount: response?.view_tokens_aggregate.aggregate.count,
    tokens: response?.view_tokens,
    tokensLoading,
    error,
  };
};
