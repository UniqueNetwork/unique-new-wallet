import { gql, useQuery } from '@apollo/client';

const bundleTreeQuery = gql`
  fragment tokenFields on NestingToken {
    bundle_created
    burned
    children_count
    collection_id
    date_of_creation
    image
    is_sold
    owner
    owner_normalized
    parent_id
    properties
    token_id
    token_name
    token_prefix
  }
  query getBundleTree($tokenId: Int!, $collectionId: Int!) {
    bundleTree(input: { collection_id: $collectionId, token_id: $tokenId }) {
      ...tokenFields
      nestingChildren {
        ...tokenFields
        nestingChildren {
          ...tokenFields
          nestingChildren {
            ...tokenFields
            nestingChildren {
              ...tokenFields
              nestingChildren {
                ...tokenFields
              }
            }
          }
        }
      }
    }
  }
`;

export const useGraphQLGetBundleTree = (collectionId?: number) => {
  const {
    data,
    loading: isBundleFetching,
    refetch,
  } = useQuery<BundleTreeData, BundleTreeVariables>(bundleTreeQuery, {
    fetchPolicy: 'standby',
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    skip: !collectionId,
    variables: { collectionId: collectionId!, tokenId: 1 },
  });

  return { bundle: data?.bundleTree, isBundleFetching, refetch };
};

export interface BundleTreeVariables {
  collectionId: number;
  tokenId: number;
}

export interface BundleTreeData {
  bundleTree: NestingToken;
}

export type NestingToken = {
  bundle_created: number | null;
  burned: boolean;
  children_count: number | null;
  collection_id: number;
  date_of_creation: number;
  image: {
    fullUrl: string | null;
  };
  is_sold: boolean;
  nestingChildren?: NestingToken[] | never[];
  owner: string;
  owner_normalized: string;
  parent_id: string | null;
  token_id: number;
  token_name: string;
  token_prefix?: string;
};
