import { gql, useQuery } from '@apollo/client';

import { AccountCommonInfoResponse } from './types';

const accountCommonInfoQuery = gql`
  query getAccountCommonInfo($accountId: String) {
    tokens(
      where: {
        _or: [{ owner: { _eq: $accountId } }, { owner_normalized: { _eq: $accountId } }]
      }
    ) {
      count
    }
    collections(
      where: {
        _or: [{ owner: { _eq: $accountId } }, { owner_normalized: { _eq: $accountId } }]
      }
    ) {
      count
    }
  }
`;

export const useGraphQlAccountCommonInfo = (accountId?: string) => {
  const { data, loading } = useQuery<AccountCommonInfoResponse>(accountCommonInfoQuery, {
    skip: !accountId,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: { accountId },
  });

  return {
    accountCommonInfoLoading: loading,
    tokensTotal: data?.tokens?.count,
    collectionsTotal: data?.collections?.count,
  };
};
