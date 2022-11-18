import { gql, useQuery } from '@apollo/client';

import { Collection, QueryResponse } from '@app/api/graphQL/types';
import { TCollectionsCacheVar } from '@app/api';

const COLLECTIONS_BY_CACHE_QUERY = gql`
  query collections_by_cache_query($where: CollectionWhereParams) {
    collections(where: $where) {
      count
      data {
        collection_id
      }
    }
  }
`;

export const useGraphQlCheckInExistCollectionsByAccount = ({
  collections,
  skip,
}: {
  collections: TCollectionsCacheVar;
  skip: boolean;
}) => {
  const collectionsIds = collections.map(({ collectionId }) => collectionId);
  const { data: response, refetch } = useQuery<
    QueryResponse<Pick<Collection, 'collection_id'>>
  >(COLLECTIONS_BY_CACHE_QUERY, {
    skip,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      where: {
        collection_id: { _in: collectionsIds },
        burned: { _eq: 'false' },
      },
    },
  });

  return {
    refetchCheckInExistCollections: refetch,
    synchronizedCollectionsIds:
      response?.collections.data?.map(({ collection_id }) => collection_id) ?? [],
  };
};
