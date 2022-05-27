import { Nullable } from '@app/types';

export type SchemaVersion = 'ImageURL' | 'Unique';

export type VariableOnChainSchema = {
  collectionCover?: string;
};

// can be common and extendeble for othe API methods to collections table
export interface Collection {
  collection_id: number;
  name: string;
  owner: string;
  offchain_schema: string;
  schema_version: SchemaVersion;
  variable_on_chain_schema?: VariableOnChainSchema;
}

export interface ViewCollection {
  collection_cover: string;
  collection_id: number;
  description: string;
  name: string;
  offchain_schema: string;
  owner: string;
  token_limit: number;
  tokens_count: number;
  token_prefix: string;
  date_of_creation?: number;
  schema_version?: string;
  sponsorship: Nullable<string>;
  owner_can_destroy?: Nullable<boolean>;
}

export interface CollectionsVariables {
  limit?: number;
  offset?: number;
  where?: Record<string, unknown>;
}

export interface CollectionsData {
  view_collections: ViewCollection[];
  view_collections_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export type useGraphQlCollectionsProps = {
  pageSize?: number;
  filter?: Record<string, unknown>;
};

export type FetchMoreCollectionsOptions = {
  limit?: number;
  offset?: number;
  searchString?: string;
};
