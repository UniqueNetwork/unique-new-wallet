import { gql, useQuery } from '@apollo/client';

import { useAccounts } from '@app/hooks';

import { QueryResponse, Token } from '../types';

const GET_TOKENS_COLLECTION = gql`
  query GetTokensCollection(
    $offset: Int
    $limit: Int
    $where: TokenWhereParams
    $direction: GQLOrderByParamsArgs
  ) {
    tokens(
      where: $where
      offset: $offset
      limit: $limit
      order_by: { token_id: $direction }
    ) {
      count
      data {
        token_id
        token_name
        token_prefix
        collection_id
        collection_name
        image
      }
    }
  }
`;

export const useGraphQlGetTokensCollection = ({
  collectionId,
  excludeCurrentTokenId,
}: {
  collectionId: number | undefined;
  excludeCurrentTokenId: number | undefined;
}) => {
  const { selectedAccount } = useAccounts();
  const { data: response, loading } = useQuery<QueryResponse<Token>>(
    GET_TOKENS_COLLECTION,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
      skip: !collectionId,
      variables: {
        limit: 10000,
        where: {
          burned: { _eq: 'false' },
          type: { _in: ['NFT', 'NESTED'] },
          ...(excludeCurrentTokenId !== undefined && {
            token_id: { _neq: excludeCurrentTokenId },
          }),
          collection_id: { _eq: collectionId },
          _and: [
            {
              _or: [
                { collection_owner: { _eq: selectedAccount?.address } },
                { collection_owner_normalized: { _eq: selectedAccount?.address } },
              ],
            },
            {
              _or: [
                { tokens_owner: { _eq: selectedAccount?.address } },
                { owner_normalized: { _eq: selectedAccount?.address } },
              ],
            },
          ],
        },
      },
    },
  );

  return {
    isTokensLoading: loading,
    tokens: response?.tokens.data ?? [],
  };
};
