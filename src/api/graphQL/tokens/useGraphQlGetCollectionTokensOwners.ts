import { useQuery, gql } from '@apollo/client';

import { ListNftsFilterType } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';

import { QueryResponse, QueryOptions, RftFraction } from '../types';
import { getConditionBySearchText } from './utils';

const COLLECTION_TOKENS_OWNERS_QUERY = gql`
  query CollectionTokensOwnersQuery(
    $offset: Int
    $limit: Int
    $where: TokenOwnersWhereParams
  ) {
    token_owners(where: $where, offset: $offset, limit: $limit) {
      count
      data {
        collection_id
        token_id
        amount
        collection_id
        owner
      }
    }
  }
`;

export const useGraphQlGetCollectionTokensOwners = ({
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
  } = options;
  const { search, type } = filter;
  let ownership = {};
  switch (type) {
    case 'owned':
      ownership = [{ owner: { _eq: collectionOwner } }];
      break;
    case 'disowned':
      ownership = [{ owner: { _neq: collectionOwner } }];
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
  } = useQuery<QueryResponse<RftFraction>>(COLLECTION_TOKENS_OWNERS_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit,
      offset: limit * page,
      where: {
        collection_id: { _eq: collectionId },
        _or: ownership,
        ...(Number(search) ? { token_id: { _eq: Number(search) } } : {}),
        amount: { _neq: '0' },
      },
    },
  });
  const tokenOwnersCount = response?.token_owners.count ?? 0;

  return {
    refetchCollectionTokens: refetch,
    fetchMore,
    isPagination: tokenOwnersCount > limit,
    isLoadingTokens: loading,
    tokenOwners: response?.token_owners.data ?? [],
    tokenOwnersCount,
    errorTokens: error,
  };
};
