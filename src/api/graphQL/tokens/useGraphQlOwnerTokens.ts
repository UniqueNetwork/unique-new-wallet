import { gql, OperationVariables, useQuery } from '@apollo/client';

import { getConditionBySearchText } from '@app/api/graphQL/tokens/utils';

import { OptionsTokenCollection, ViewToken } from './types';

export type Direction = 'asc' | 'desc';
export type TypeFilter = 'purchased' | 'createdByMe';

type AdditionalFilters = {
  collectionsIds?: number[];
  typesFilters?: TypeFilter[];
  searchText?: string;
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
    $direction: order_by
  ) {
    view_tokens(
      where: $where
      offset: $offset
      limit: $limit
      order_by: { token_id: $direction }
    ) {
      image_path
      token_id
      token_name
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

const getConditionByTypesFilters = (
  owner: string | undefined,
  filtersTypes: TypeFilter[] | undefined,
) => {
  const baseFilter = {
    _or: [{ owner: { _eq: owner } }, { owner_normalized: { _eq: owner } }],
  };

  const filters: Record<TypeFilter, OperationVariables> = {
    purchased: {
      _and: [baseFilter, { is_sold: { _eq: true } }],
    },
    createdByMe: {
      _and: [baseFilter, { is_sold: { _eq: false } }],
    },
  };

  if (!Number(filtersTypes?.length)) {
    return baseFilter;
  }

  return { _or: filtersTypes?.map((ft) => filters[ft]) };
};

const getConditionByCollectionsIds = (collectionsIds: number[] | undefined) => {
  if (!collectionsIds || collectionsIds.length === 0) {
    return null;
  }

  return {
    collection_id: {
      _in: collectionsIds,
    },
  };
};

export const useGraphQlOwnerTokens = (
  owner: string | undefined,
  filters: AdditionalFilters,
  options: OptionsTokenCollection,
) => {
  const { collectionsIds, typesFilters, searchText } = filters;
  const { direction, pagination, skip } = options ?? {
    direction: 'desc',
    skip: !owner,
  };
  const { page, limit } = pagination;

  const {
    data: response,
    loading: tokensLoading,
    error,
  } = useQuery<OwnerTokensResponse>(OWNER_TOKENS_QUERY, {
    skip: skip || !owner,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit,
      offset: limit * page,
      direction,
      where: {
        ...getConditionBySearchText('token_name', searchText),
        ...getConditionByTypesFilters(owner, typesFilters),
        ...getConditionByCollectionsIds(collectionsIds),
      },
    },
  });

  return {
    tokensCount: response?.view_tokens_aggregate.aggregate.count,
    tokens: response?.view_tokens,
    tokensLoading,
    error,
  };
};
