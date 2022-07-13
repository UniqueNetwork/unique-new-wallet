import { gql, useQuery } from '@apollo/client';

import {
  AccountCollectionsData,
  AccountCollectionsVariables,
  OptionsAccountCollection,
} from '@app/api';
import { getConditionBySearchText } from '@app/api/graphQL/tokens/utils';

const accountCollectionsQuery = gql`
  query getAccountCollections(
    $limit: Int
    $offset: Int
    $order_by: [view_collections_order_by!]
    $where: view_collections_bool_exp = {}
  ) {
    view_collections(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
      collection_cover
      name
      collection_id
      owner_normalized
      tokens_count
    }
    view_collections_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export const useGraphQlCollectionsByAccount = ({
  accountAddress,
  options,
}: {
  accountAddress: string | undefined;
  options: OptionsAccountCollection;
}) => {
  const {
    order,
    pagination: { page, limit },
    search,
  } = options;
  const { data, error, loading } = useQuery<
    AccountCollectionsData,
    AccountCollectionsVariables
  >(accountCollectionsQuery, {
    skip: !accountAddress,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    variables: {
      limit,
      offset: limit * page,
      order_by: order,
      where: {
        _or: [
          { owner: { _eq: accountAddress } },
          { owner_normalized: { _eq: accountAddress } },
        ],
        ...getConditionBySearchText('name', search),
        type: { _eq: '{"nft":null}' },
      },
    },
  });

  return {
    collections: data?.view_collections || [],
    collectionsCount: data?.view_collections_aggregate.aggregate.count || 0,
    isCollectionsLoading: loading,
    error,
  };
};
