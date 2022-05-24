import { useState } from 'react';
import { gql, OperationVariables, useQuery } from '@apollo/client';

import { ViewToken } from './types';

type Direction = 'asc' | 'desc';
type FilterType = 'all' | 'purchased' | 'createdByMe';

type AdditionalFilters = {
  collectionIds?: number[];
  filterType?: FilterType;
};

type Pagination = {
  defaultPage: number;
  limit: number;
};

type Options = {
  direction?: Direction;
  pagination?: Pagination;
  skip?: boolean;
};

type OwnerTokensResponse = {
  view_tokens: ViewToken[];
  view_tokens_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

const OWNER_TOKENS_QUERY = gql`
  query GetGraphQlOwnerTokens(
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

const filtersByType = (owner: string | undefined, filterType: FilterType) =>
  ((
    {
      all: { _or: [{ owner: { _eq: owner } }, { collection_owner: { _eq: owner } }] },
      purchased: { _and: [{ owner: { _eq: owner } }, { is_sold: { _eq: true } }] },
      createdByMe: { collection_owner: { _eq: owner } },
    } as Record<FilterType, OperationVariables>
  )[filterType]);

export const useGraphQlOwnerTokens = (
  owner: string | undefined,
  filters: AdditionalFilters,
  options?: Options,
) => {
  const { collectionIds, filterType } = filters;
  const { direction, pagination, skip } = options ?? {
    direction: 'desc',
    skip: !owner,
  };
  const { defaultPage, limit } = pagination ?? { defaultPage: 0, limit: 10 };

  const [page, setPage] = useState(defaultPage);

  const {
    data: response,
    loading: tokensLoading,
    error,
  } = useQuery<OwnerTokensResponse>(OWNER_TOKENS_QUERY, {
    skip: skip || !owner,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit,
      offset: limit * page,
      direction,
      where: {
        ...filtersByType(owner, filterType ?? 'all'),
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
