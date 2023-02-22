import { gql, useQuery } from '@apollo/client';

import { Collection, QueryResponse } from '../types';

const COLLECTION_BY_ID_QUERY = gql`
  query collection_by_id_query($collectionId: Float, $address: String) {
    collections(
      where: {
        collection_id: { _eq: $collectionId }
        burned: { _eq: "false" }
        _or: [{ owner: { _eq: $address } }, { owner_normalized: { _eq: $address } }]
      }
    ) {
      data {
        token_limit
        token_prefix
        tokens_count
        collection_id
        collection_cover
        sponsorship
        description
        date_of_creation
        owner_can_destroy
        mode
      }
    }
  }
`;

export const useGraphQlCollectionById = (collectionId?: number, address?: string) => {
  const {
    data: response,
    loading,
    error,
  } = useQuery<QueryResponse<Collection>>(COLLECTION_BY_ID_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: {
      collectionId,
      address,
    },
    skip: !collectionId || !address,
  });

  return {
    error,
    loading,
    collection: response?.collections.data?.[0],
  };
};
