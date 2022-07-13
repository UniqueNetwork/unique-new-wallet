import { gql, useQuery } from '@apollo/client';

import { AccountCommonInfoResponse } from './types';

const accountCommonInfoQuery = gql`
  query getAccountCommonInfo($accountId: String!) {
    view_collections_aggregate(
      where: {
        _or: [{ owner: { _eq: $accountId } }, { owner_normalized: { _eq: $accountId } }]
      }
    ) {
      aggregate {
        count(columns: collection_id)
      }
    }
    view_tokens_aggregate(
      where: {
        _or: [{ owner: { _eq: $accountId } }, { owner_normalized: { _eq: $accountId } }]
      }
    ) {
      aggregate {
        count(columns: token_id)
      }
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
    tokensTotal: data?.view_tokens_aggregate?.aggregate.count,
    collectionsTotal: data?.view_collections_aggregate?.aggregate.count,
  };
};
