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
  const { data: response } = useQuery<QueryResponse<Pick<Collection, 'collection_id'>>>(
    COLLECTIONS_BY_CACHE_QUERY,
    {
      skip,
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      variables: {
        where: {
          collection_id: { _in: collectionsIds },
        },
      },
    },
  );

  return {
    synchronizedCollectionsIds:
      response?.collections.data?.map(({ collection_id }) => collection_id) ?? [],
  };
};
