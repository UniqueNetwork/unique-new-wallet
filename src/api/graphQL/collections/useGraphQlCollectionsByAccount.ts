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

export const useGraphQlCollectionsByAccount = (accountAddress: string | undefined) => {
  const {
    data: response,
    loading: userCollectionsLoading,
    error,
  } = useQuery(ACCOUNT_COLLECTIONS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: { owner: accountAddress },
  }) as unknown as { data: AccountCollectionsResponse; error: string; loading: boolean };

  return {
    collections: response?.collections,
    collectionsLoading: userCollectionsLoading,
    error,
  };
};
