import { gql, useQuery } from '@apollo/client';

import { CollectionPreview } from '@app/api';

type CollectionsByTokensOwnerResponse = {
  view_tokens: CollectionPreview[];
};

const COLLECTIONS_BY_TOKENS_OWNER = gql`
  query Collections($owner: String) {
    view_tokens(
      where: { _or: [{ owner: { _eq: $owner } }, { collection_owner: { _eq: $owner } }] }
      distinct_on: collection_id
    ) {
      collection_cover
      collection_id
      collection_name
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
  } = useQuery<CollectionsByTokensOwnerResponse>(COLLECTIONS_BY_TOKENS_OWNER, {
    skip,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: { owner },
  });

  return {
    collections: response?.view_tokens,
    collectionsLoading: userCollectionsLoading,
    error,
  };
};
