import { gql, useQuery } from '@apollo/client';

import { QueryResponse, Token } from '@app/api/graphQL/types';
import { TTokensVar } from '@app/api';

const TOKENS_QUERY = gql`
  query check_exist_tokens_account($where: TokenWhereParams) {
    tokens(where: $where) {
      count
      data {
        token_id
        collection_id
      }
    }
  }
`;

export const useGraphQlCheckInExistTokensByAccount = ({
  tokens,
  collectionId,
}: {
  tokens: TTokensVar;
  collectionId?: number;
}) => {
  const groupsTokens = tokens.reduce<Record<number, number[]>>(
    (prev, { collectionId, tokenId }) => {
      if (collectionId in prev) {
        prev[collectionId].push(tokenId);
      } else {
        prev[collectionId] = [tokenId];
      }
      return prev;
    },
    {},
  );

  const { data: response, refetch } = useQuery<
    QueryResponse<Pick<Token, 'token_id' | 'collection_id'>>
  >(TOKENS_QUERY, {
    skip: tokens.length === 0,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      where: {
        ...(collectionId !== undefined
          ? {
              collection_id: { _eq: collectionId },
              token_id: { _in: groupsTokens[collectionId] },
            }
          : {
              _or: Object.entries(groupsTokens).map(([collectionId, tokenIds]) => ({
                _and: [
                  {
                    collection_id: { _eq: Number(collectionId) },
                    token_id: { _in: tokenIds },
                  },
                ],
              })),
            }),
      },
    },
  });

  return {
    synchronizedTokensIds: response?.tokens.data || [],
    refetchSynchronizedTokens: refetch,
  };
};
