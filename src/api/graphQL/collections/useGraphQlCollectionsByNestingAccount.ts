import { gql, useQuery } from '@apollo/client';

import { Collection, QueryResponse } from '../types';

const COLLECTIONS_BY_ACCOUNT_NESTING_QUERY = gql`
  query collections_by_account_nesting_query(
    $limit: Int
    $offset: Int
    $order_by: TokenOwnersOrderByParams
    $where: TokenOwnersWhereParams
  ) {
    token_owners(
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
      distinct_on: collection_id
    ) {
      count
      data {
        collection_id
      }
    }
  }
`;

export const useGraphQlCollectionsByNestingAccount = ({
  accountAddress,
}: {
  accountAddress: string | undefined;
}) => {
  const { data: response, loading } = useQuery<
    QueryResponse<Pick<Collection, 'collection_id'>>
  >(COLLECTIONS_BY_ACCOUNT_NESTING_QUERY, {
    skip: !accountAddress,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit: 10000,
      where: {
        owner: { _eq: accountAddress },
        amount: {
          _neq: '0',
        },
      },
    },
  });

  return {
    collectionsIds: response?.token_owners.data ?? [],
    isCollectionsLoading: loading,
  };
};
