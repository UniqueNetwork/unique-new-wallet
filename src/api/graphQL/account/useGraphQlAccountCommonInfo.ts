import { gql, useQuery } from '@apollo/client';

import { QueryResponse } from '../types';

const ACCOUNT_COMMON_INFO_QUERY = gql`
  query account_common_info_query($accountId: String) {
    tokens(
      where: {
        _or: [{ owner: { _eq: $accountId } }, { owner_normalized: { _eq: $accountId } }]
        burned: { _eq: "false" }
      }
    ) {
      count
    }
    collections(
      where: {
        _or: [{ owner: { _eq: $accountId } }, { owner_normalized: { _eq: $accountId } }]
        burned: { _eq: "false" }
      }
    ) {
      count
    }
  }
`;

export const useGraphQlAccountCommonInfo = (accountId?: string) => {
  const { data, loading } = useQuery<QueryResponse>(ACCOUNT_COMMON_INFO_QUERY, {
    skip: !accountId,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: { accountId },
  });

  return {
    accountCommonInfoLoading: loading,
    tokensTotal: data?.tokens.count,
    collectionsTotal: data?.collections.count,
  };
};
