import { gql, useQuery } from '@apollo/client';

import { Collection } from './types';

export type AccountCollectionsResponse = {
  collections: Collection[];
};

const ACCOUNT_COLLECTIONS = gql`
  query Collections($owner: String) {
    collections(
      where: { _or: [{ owner: { _eq: $owner } }, { owner_normalized: { _eq: $owner } }] }
    ) {
      name
      description
      owner
      owner_normalized
      collection_id
      schema_version
      offchain_schema
      const_chain_schema
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
    loading,
    error,
  } = useQuery<AccountCollectionsResponse>(ACCOUNT_COLLECTIONS, {
    skip,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: { owner: accountAddress },
  });

  return {
    collections: response?.collections,
    collectionsLoading: loading,
    error,
  };
};
