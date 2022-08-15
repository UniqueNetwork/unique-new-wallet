import { gql, useQuery } from '@apollo/client';

import { ViewToken } from './types';

type TokenByIdResponse = {
  view_tokens: ViewToken[];
};

const TOKEN_BY_ID_QUERY = gql`
  query TokenByIdQuery($tokenId: Float, $collectionId: Float) {
    tokens(
      where: { token_id: { _eq: $tokenId }, collection_id: { _eq: $collectionId } }
    ) {
      count
      data {
        date_of_creation
        owner
        token_id
        token_name
        collection_cover
        collection_id
        collection_name
        collection_description
      }
    }
  }
`;

export const useGraphQlTokenById = (tokenId: number, collectionId: number) => {
  const { data, loading, error, refetch } = useQuery<TokenByIdResponse>(
    TOKEN_BY_ID_QUERY,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
      variables: {
        tokenId,
        collectionId,
      },
    },
  );

  return {
    error,
    loading,
    token: (data as any).tokens.data[0],
    refetch,
  };
};
