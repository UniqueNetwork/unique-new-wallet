import { gql, useQuery } from '@apollo/client';

import { Collection, QueryResponse } from '../types';

const COLLECTIONS_BY_ACCOUNT_NESTING_QUERY = gql`
  query collections_by_account_nesting_query(
    $limit: Int
    $offset: Int
    $order_by: CollectionOrderByParams
    $where: CollectionWhereParams
  ) {
    collections(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
      count
      data {
        name
        collection_id
        collection_cover
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
    QueryResponse<Pick<Collection, 'collection_id' | 'name' | 'collection_cover'>>
  >(COLLECTIONS_BY_ACCOUNT_NESTING_QUERY, {
    skip: !accountAddress,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit: 10000,
      where: {
        _or: [
          { owner: { _eq: accountAddress } },
          { owner_normalized: { _eq: accountAddress } },
        ],
        nesting_enabled: {
          _eq: 'true',
        },
      },
    },
  });

  return {
    collections: response?.collections.data ?? [],
    isCollectionsLoading: loading,
  };
};
