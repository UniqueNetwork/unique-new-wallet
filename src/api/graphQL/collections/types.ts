export interface Collection {
  collection_cover: string;
  collection_id: number;
  description: string;
  name: string;
  offchain_schema: string;
  owner: string;
  token_limit: number;
  token_prefix: string;
  // additional properties needed
  tokens_aggregate?: {
    aggregate: {
      count: number;
    };
  };
  type?: string;
  date_of_creation?: string;
  holders_count?: number;
  actions_count?: number;
  owner_can_trasfer?: string;
  owner_can_destroy?: string;
  schema_version?: string;
}

export interface CollectionsVariables {
  limit?: number;
  offset?: number;
  where?: Record<string, unknown>;
}

export interface CollectionsData {
  view_collections: Collection[];
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
