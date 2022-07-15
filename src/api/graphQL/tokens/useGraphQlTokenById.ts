import { gql, useQuery } from '@apollo/client';

import { ViewToken } from './types';

type TokenByIdResponse = {
  tokens: {
    data: ViewToken[];
  };
};

const TOKEN_BY_ID_QUERY = gql`
  query TokenByIdQuery($tokenId: Int, $collectionId: Int) {
    tokens(
      where: { token_id: { _eq: $tokenId }, collection_id: { _eq: $collectionId } }
    ) {
      data {
        owner
        token_id
        token_name
        collection_cover
        collection_id
        collection_name
        collection_description
        image_path
        data
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
    token: data?.tokens.data[0],
    refetch,
  };
};
