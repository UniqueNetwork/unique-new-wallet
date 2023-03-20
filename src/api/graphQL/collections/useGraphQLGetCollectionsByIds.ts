import { gql, useQuery } from '@apollo/client';

import { Collection, QueryResponse } from '@app/api/graphQL/types';
import { TCollectionsCacheVar } from '@app/api';

const COLLECTIONS_BY_CACHE_QUERY = gql`
  query collections_by_ids($where: CollectionWhereParams) {
    collections(where: $where, order_by: { collection_id: asc }) {
      count
      data {
        collection_id
        collection_cover
        name
      }
    }
  }
`;

export const useGraphQlGetCollectionsByIds = ({
  collections,
}: {
  collections: TCollectionsCacheVar;
}) => {
  const collectionsIds = collections.map(({ collectionId }) => collectionId);
  const {
    data: response,
    refetch,
    loading: isSynchronizedCollectionsLoading,
  } = useQuery<
    QueryResponse<Pick<Collection, 'collection_id' | 'name' | 'collection_cover'>>
  >(COLLECTIONS_BY_CACHE_QUERY, {
    skip: !collectionsIds.length,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit: 100000,
      where: {
        collection_id: { _in: collectionsIds },
        burned: { _eq: 'false' },
        nesting_enabled: {
          _eq: 'true',
        },
      },
    },
  });

  return {
    isSynchronizedCollectionsLoading,
    refetchCollectionsByIds: refetch,
    synchronizedCollections: response?.collections.data ?? [],
  };
};
