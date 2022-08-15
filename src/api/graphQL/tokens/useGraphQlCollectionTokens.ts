import { useQuery, gql, ApolloError } from '@apollo/client';

import { OptionsTokenCollection, TokenPreviewInfo } from '@app/api';
import { getConditionBySearchText } from '@app/api/graphQL/tokens/utils';
import { ListNftsFilterType } from '@app/pages/CollectionPage/components/CollectionNftFilters/context';

const COLLECTION_TOKENS = gql`
  query CollectionTokens(
    $where: view_tokens_bool_exp
    $offset: Int
    $limit: Int
    $direction: order_by
  ) {
    view_tokens(
      where: $where
      offset: $offset
      limit: $limit
      order_by: { token_id: $direction }
    ) {
      token_name
      token_prefix
      token_id
      image_path
      collection_id
      collection_name
    }
    view_tokens_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const useGraphQlCollectionTokens = ({
  filter,
  collectionOwner,
  options,
  collectionId,
}: {
  collectionId: string;
  collectionOwner: string | undefined;
  filter: { search: string; type: ListNftsFilterType };
  options: OptionsTokenCollection;
}) => {
  const {
    pagination: { page, limit },
    direction,
  } = options;
  const { search, type } = filter;
  const { loading, data, error } = useQuery(COLLECTION_TOKENS, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit,
      offset: limit * page,
      direction,
      where: {
        collection_id: { _eq: collectionId },
        _or: [
          { collection_owner: { _eq: collectionOwner } },
          { collection_owner_normalized: { _eq: collectionOwner } },
        ],
        ...(type !== 'all' && { is_sold: { _eq: type === 'disowned' } }),
        ...getConditionBySearchText('token_name', search),
      },
    },
  });
  return {
    isLoadingTokens: loading,
    tokens: data?.view_tokens,
    tokensCount: data?.view_tokens_aggregate.aggregate.count,
    errorTokens: error,
  };
};
