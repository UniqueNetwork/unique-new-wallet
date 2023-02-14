import { gql, useQuery } from '@apollo/client';

import { QueryResponse, Token } from '../types';

const COLLECTIONS_BY_TOKENS_OWNER_QUERY = gql`
  query collections_by_tokens_owner_query($owner: String) {
    tokens(
      where: {
        _or: [{ tokens_owner: { _eq: $owner } }, { owner_normalized: { _eq: $owner } }]
        burned: { _eq: "false" }
      }
      distinct_on: collection_id
      limit: 1000
    ) {
      count
      data {
        collection_cover
        collection_id
        collection_name
      }
    }
  }
`;

export const useGraphQlCollectionsByTokensOwner = (
  owner: string | undefined,
  skip?: boolean,
) => {
  const {
    data: response,
    loading: userCollectionsLoading,
    error,
  } = useQuery<QueryResponse<Token>>(COLLECTIONS_BY_TOKENS_OWNER_QUERY, {
    skip,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: { owner },
  });

  return {
    collections: response?.tokens.data,
    collectionsLoading: userCollectionsLoading,
    error,
  };
};
