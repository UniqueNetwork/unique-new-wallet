import { useQuery, gql } from '@apollo/client';

import { ListNftsFilterType } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';

import { QueryResponse, Token, QueryOptions } from '../types';
import { getConditionBySearchText } from './utils';

const COLLECTION_TOKENS_QUERY = gql`
  query CollectionTokensQuery(
    $offset: Int
    $limit: Int
    $where: TokenWhereParams
    $sort: TokenOrderByParams
  ) {
    tokens(where: $where, offset: $offset, limit: $limit, order_by: $sort) {
      count
      data {
        token_id
        token_name
        token_prefix
        collection_id
        collection_name
        image
        type
        children_count
        parent_id
        owner
        total_pieces
        tokens_owner
        tokens_amount
        nested
      }
    }
  }
`;

export const useGraphQlCollectionTokens = ({
  filter,
  collectionOwner,
  options,
  collectionId,
}: {
  collectionId: number;
  collectionOwner: string | undefined;
  filter: { search: string; type: ListNftsFilterType };
  options: QueryOptions;
}) => {
  const {
    pagination: { page, limit },
    sort,
  } = options;
  const { search, type } = filter;
  let ownership = {};
  switch (type) {
    case 'owned':
      ownership = [{ tokens_owner: { _eq: collectionOwner } }];
      break;
    case 'disowned':
      ownership = [{ tokens_owner: { _neq: collectionOwner } }];
      break;
    default:
      break;
  }
  const {
    data: response,
    fetchMore,
    loading,
    error,
    refetch,
  } = useQuery<QueryResponse<Token>>(COLLECTION_TOKENS_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit,
      offset: limit * page,
      sort,
      where: {
        collection_id: { _eq: collectionId },
        _or: ownership,
        ...getConditionBySearchText('token_name', search),
        burned: { _eq: 'false' },
        tokens_amount: { _neq: '0' },
      },
    },
  });
  const tokensCount = response?.tokens.count ?? 0;

  return {
    refetchCollectionTokens: refetch,
    fetchMore,
    isPagination: tokensCount > limit,
    isLoadingTokens: loading,
    tokens: response?.tokens.data ?? [],
    tokensCount,
    errorTokens: error,
  };
};
