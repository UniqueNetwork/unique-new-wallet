import { gql, useQuery } from '@apollo/client';

import { ViewToken } from './types';

type TokenByIdResponse = {
  view_tokens: ViewToken[];
};

const TOKEN_BY_ID_QUERY = gql`
  query TokenByIdQuery($tokenId: Int, $collectionId: bigint) {
    view_tokens(
      where: { collection_id: { _eq: $collectionId }, token_id: { _eq: $tokenId } }
    ) {
      owner
      token_name
      collection_cover
      collection_id
      collection_owner
      collection_name
      token_id
      collection_description
      data
      image_path
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
    token: data?.view_tokens[0],
    refetch,
  };
};
