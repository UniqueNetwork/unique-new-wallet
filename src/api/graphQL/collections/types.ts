import { Nullable, Pagination, ProtobufAttributeType } from '@app/types';
import { Direction } from '@app/api/graphQL/tokens';

export type SchemaVersion = 'ImageURL' | 'Unique';

export type VariableOnChainSchema = {
  collectionCover?: string;
};

export type TOrderBy = {
  collection_id?: Direction;
  tokens_count?: Direction;
};

export type OptionsAccountCollection = {
  skip?: boolean;
  order?: TOrderBy;
  pagination: Pagination;
  search?: string;
};

// can be common and extendeble for othe API methods to collections table
export interface Collection {
  collection_id: number;
  name: string;
  description?: string;
  owner: string;
  offchain_schema: string;
  schema_version: SchemaVersion;
  const_on_chain_schema?: ProtobufAttributeType;
  variable_on_chain_schema?: VariableOnChainSchema;
  owner_normalized: string;
  collection_cover: string;
  tokens_count: number;
}

export type AccountCollectionsData = {
  view_collections: Collection[];
  view_collections_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

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

export interface AccountCollectionsVariables extends CollectionsVariables {
  order_by?: TOrderBy;
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
