import { FetchMoreOptions, gql, OperationVariables, useQuery } from '@apollo/client';

import { getConditionBySearchText } from '@app/api/graphQL/tokens/utils';

import { QueryOptions, QueryResponse, Token } from '../types';

export type TypeFilter = 'purchased' | 'createdByMe';

type AdditionalFilters = {
  collectionsIds?: number[];
  typesFilters?: TypeFilter[];
  searchText?: string;
};

const OWNER_TOKENS_QUERY = gql`
  query owner_tokens_query(
    $where: TokenWhereParams
    $offset: Int
    $limit: Int
    $direction: GQLOrderByParamsArgs
  ) {
    tokens(
      where: $where
      offset: $offset
      limit: $limit
      order_by: { token_id: $direction }
    ) {
      count
      data {
        token_id
        token_name
        collection_name
        collection_id
        image
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
      _and: [baseFilter, { is_sold: { _eq: 'true' } }],
    },
    createdByMe: {
      _and: [baseFilter, { is_sold: { _eq: 'false' } }],
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
  options: QueryOptions,
) => {
  const { collectionsIds, typesFilters, searchText } = filters;
  const { direction, pagination, skip } = options ?? {
    direction: 'desc',
    skip: !owner,
  };
  const { page, limit } = pagination;

  const fetchMoreMethod = (variables: FetchMoreOptions) => {
    fetchMore({
      ...variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return fetchMoreResult;
      },
    });
  };

  const {
    data: response,
    loading: tokensLoading,
    error,
    fetchMore,
  } = useQuery<QueryResponse<Token>>(OWNER_TOKENS_QUERY, {
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

  const tokensCount = response?.tokens.count ?? 0;

  return {
    isPagination: tokensCount > limit,
    tokensCount,
    tokens: response?.tokens.data,
    fetchMoreMethod,
    tokensLoading,
    error,
  };
};
