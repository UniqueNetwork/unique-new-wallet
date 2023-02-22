import { gql, useQuery } from '@apollo/client';

import { QueryResponse, Token } from '../types';

const TOKEN_BY_ID_QUERY = gql`
  query token_by_id_query($tokenId: Float, $collectionId: Float) {
    tokens(
      where: {
        token_id: { _eq: $tokenId }
        collection_id: { _eq: $collectionId }
        burned: { _eq: "false" }
      }
    ) {
      count
      data {
        date_of_creation
        owner
        image
        token_id
        token_name
        attributes
        collection_cover
        collection_id
        collection_name
        collection_description
      }
    }
  }
`;

export const useGraphQlTokenById = (tokenId: number, collectionId: number) => {
  const {
    data: response,
    loading,
    refetch,
    error,
  } = useQuery<QueryResponse<Token>>(TOKEN_BY_ID_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    variables: {
      tokenId,
      collectionId,
    },
  });

  return {
    error,
    loading,
    refetch,
    token: response?.tokens.data?.[0],
  };
};
