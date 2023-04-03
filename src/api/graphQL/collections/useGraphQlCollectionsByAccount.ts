import { gql, useQuery } from '@apollo/client';

import { OptionsAccountCollection } from '@app/api';

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
}: {
  accountAddress: string | undefined;
  options: OptionsAccountCollection;
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
    refetch,
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
        _and: [
          {
            _or: [
              { owner: { _eq: accountAddress } },
              { owner_normalized: { _eq: accountAddress } },
            ],
          },
          ...applySearchFilter(search?.trim() || ''),
        ],
        burned: { _eq: 'false' },
      },
    },
  });

  const collectionsCount = response?.collections?.count ?? 0;

  return {
    collections: response?.collections.data ?? [],
    collectionsCount,
    fetchMore,
    refetchCollectionsByAccount: refetch,
    isPagination: collectionsCount > limit,
    isCollectionsLoading: loading,
    error,
  };
};

const applySearchFilter = (search: string) => {
  if (!search) {
    return [];
  }

  return [
    {
      _or: [
        { name: { _ilike: `%${search}%` } },
        ...(Number(search) ? [{ collection_id: { _eq: Number(search) } }] : []),
      ],
    },
  ];
};
