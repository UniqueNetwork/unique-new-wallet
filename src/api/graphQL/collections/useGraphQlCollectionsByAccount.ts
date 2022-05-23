import { gql, useQuery } from '@apollo/client';

import { Collection } from './types';

export type AccountCollectionsResponse = {
  collections: Collection[];
};

const ACCOUNT_COLLECTIONS = gql`
  query Collections($owner: String) {
    collections(where: { owner: { _eq: $owner } }) {
      name
      owner
      collection_id
      schema_version
      offchain_schema
      variable_on_chain_schema
    }
  }
`;

export const useGraphQlCollectionsByAccount = (
  accountAddress: string | null,
  skip?: boolean,
) => {
  const {
    data: response,
    loading: userCollectionsLoading,
    error,
  } = useQuery<AccountCollectionsResponse>(ACCOUNT_COLLECTIONS, {
    skip,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: { owner: accountAddress },
  });

  return {
    collections: response?.collections,
    collectionsLoading: userCollectionsLoading,
    error,
  };
};
