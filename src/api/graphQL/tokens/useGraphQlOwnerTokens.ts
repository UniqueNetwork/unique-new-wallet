import { Address } from '@unique-nft/utils';
import { gql, OperationVariables, useQuery } from '@apollo/client';

import { getConditionBySearchText } from '@app/api/graphQL/tokens/utils';

import { QueryOptions, QueryResponse, Token } from '../types';

export type StatusFilterNft = 'purchased' | 'createdByMe' | 'allStatus';

export type TypeFilterNft = 'allType' | 'NESTED' | 'NFT' | 'RFT';

type AdditionalFilters = {
  collectionsIds?: number[];
  statusFilter: StatusFilterNft;
  searchText?: string;
  typeFilter: TypeFilterNft;
};

const OWNER_TOKENS_QUERY = gql`
  query owner_tokens_query(
    $where: TokenWhereParams
    $offset: Int
    $limit: Int
    $order_by: TokenOrderByParams
  ) {
    tokens(where: $where, offset: $offset, limit: $limit, order_by: $order_by) {
      count
      data {
        token_id
        token_name
        collection_name
        collection_id
        image
        type
        children_count
        parent_id
        nested
        total_pieces
        owner
        tokens_owner
        tokens_amount
      }
    }
  }
`;

const getConditionByStatusFilter = (statusFilter: StatusFilterNft = 'allStatus') => {
  const filters: Record<StatusFilterNft, OperationVariables> = {
    purchased: { is_sold: { _eq: 'true' } },
    createdByMe: { is_sold: { _eq: 'false' } },
    allStatus: {},
  };

  return filters[statusFilter];
};

const getConditionByTypeFilter = (statusFilter: TypeFilterNft = 'allType') => {
  if (statusFilter === 'allType') {
    return undefined;
  }
  if (statusFilter === 'NESTED') {
    return {
      nested: {
        _eq: 'true',
      },
    };
  }
  return {
    type: {
      _eq: statusFilter,
    },
    nested: {
      _eq: 'false',
    },
  };
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
  const { collectionsIds, statusFilter, searchText, typeFilter } = filters;
  const { sort, pagination, skip } = options ?? {
    sort: { token_id: 'desc' },
    skip: !owner,
  };
  const { page, limit } = pagination;

  const {
    data: response,
    loading: tokensLoading,
    error,
    fetchMore,
    refetch,
  } = useQuery<QueryResponse<Token>>(OWNER_TOKENS_QUERY, {
    skip: skip || !owner,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit,
      offset: limit * page,
      order_by: sort,
      where: {
        ...getConditionByStatusFilter(statusFilter),
        ...getConditionByTypeFilter(typeFilter),
        ...getConditionByCollectionsIds(collectionsIds),
        tokens_owner:
          owner && Address.is.substrateAddress(owner)
            ? { _in: [owner, Address.mirror.substrateToEthereum(owner)] }
            : { _eq: owner },
        _and: [
          {
            _or: [
              { type: { _eq: 'RFT' } },
              {
                type: { _eq: 'NFT' },
                parent_id: {
                  _is_null: true,
                },
              },
            ],
          },
          ...applySearchFilter(searchText),
        ],
        tokens_amount: { _neq: '0' },
        burned: { _eq: 'false' },
      },
    },
  });

  const tokensCount = response?.tokens.count ?? 0;

  return {
    isPagination: tokensCount > limit,
    tokensCount,
    tokens: response?.tokens.data || [],
    fetchMore,
    tokensLoading,
    error,
    refetchOwnerTokens: refetch,
  };
};

const applySearchFilter = (search: string | undefined) => {
  if (!search) {
    return [];
  }

  return [
    {
      _or: [
        { token_name: { _ilike: `%${search}%` } },
        { collection_name: { _ilike: `%${search}%` } },
        ...(Number(search) ? [{ collection_id: { _eq: Number(search) } }] : []),
      ],
    },
  ];
};
