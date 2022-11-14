import { gql, useQuery } from '@apollo/client';

import { OptionsAccountCollection } from '@app/api';
import { getConditionBySearchText } from '@app/api/graphQL/tokens/utils';

import { Collection, QueryResponse } from '../types';

const COLLECTIONS_BY_ACCOUNT_QUERY = gql`
  query collections_by_account_query(
    $limit: Int
    $offset: Int
    $order_by: CollectionOrderByParams
    $where: CollectionWhereParams
  ) {
    collections(limit: $limit, offset: $offset, order_by: $order_by, where: $where) {
      count
      data {
        name
        collection_id
        collection_cover
        owner_normalized
        tokens_count
      }
    }
  }
`;

export const useGraphQlCollectionsByAccount = ({
  accountAddress,
  options,
  enabled,
}: {
  accountAddress: string | undefined;
  options: OptionsAccountCollection;
  enabled?: boolean;
}) => {
  const {
    order,
    pagination: { page, limit },
    search,
  } = options;

  const {
    data: response,
    error,
    fetchMore,
    loading,
  } = useQuery<QueryResponse<Collection>>(COLLECTIONS_BY_ACCOUNT_QUERY, {
    skip: !accountAddress,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
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
      },
    },
  });

  const fetchMoreCollections = async (page: number, search?: string) => {
    const response = await fetchMore({
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
        },
      },
    });

    const collectionsCount = response?.data?.collections?.count ?? 0;

    return {
      collections: response?.data?.collections?.data,
      isPagination: collectionsCount > limit,
      collectionsCount,
    };
  };

  const collectionsCount = response?.collections.count ?? 0;

  return {
    collections: response?.collections.data ?? [],
    collectionsCount,
    fetchMore: fetchMoreCollections,
    isPagination: collectionsCount > limit,
    isCollectionsLoading: loading,
    error,
  };
};
