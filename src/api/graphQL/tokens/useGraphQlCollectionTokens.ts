import { useQuery, gql } from '@apollo/client';

import { ListNftsFilterType } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';

import { QueryResponse, Token, QueryOptions } from '../types';
import { getConditionBySearchText } from './utils';

const COLLECTION_TOKENS_QUERY = gql`
  query CollectionTokensQuery(
    $offset: Int
    $limit: Int
    $where: TokenWhereParams
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
        token_prefix
        collection_id
        collection_name
        image
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
    direction,
  } = options;
  const { search, type } = filter;
  const {
    data: response,
    loading,
    error,
  } = useQuery<QueryResponse<Token>>(COLLECTION_TOKENS_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit,
      offset: limit * page,
      direction,
      where: {
        collection_id: { _eq: collectionId },
        _or: [
          { collection_owner: { _eq: collectionOwner } },
          { collection_owner_normalized: { _eq: collectionOwner } },
        ],
        ...(type !== 'all' && { is_sold: { _eq: `${type === 'disowned'}` } }),
        ...getConditionBySearchText('token_name', search),
      },
    },
  });
  return {
    isLoadingTokens: loading,
    tokens: response?.tokens.data,
    tokensCount: response?.tokens.count,
    errorTokens: error,
  };
};
