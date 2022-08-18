export type Direction = 'asc' | 'desc';

// depricated
export type ImagePath = {
  ipfs: string;
  type: string;
};

export type Pagination = {
  page: number;
  limit: number;
};

export type QueryOptions = {
  skip?: boolean;
  direction?: Direction;
  pagination: Pagination;
};

export interface QueryResponse<TData = void> {
  [key: string]: {
    count?: number;
    data?: TData[];
  };
}

export interface Attribute {
  name: { _: string };
  value: { _: string } | { _: string }[];
  isEnum: boolean;
  isArray: boolean;
  type:
    | 'integer'
    | 'float'
    | 'boolean'
    | 'timestamp'
    | 'string'
    | 'url'
    | 'isoDate'
    | 'time'
    | 'colorRgba';
  rawValue: {
    _: string;
  };
}

export interface Token {
  token_id: number;
  token_name: string;
  token_prefix: number;
  owner: string;
  owner_mormalized: string;
  attributes: Record<string, Attribute>;
  date_of_creation: number;
  image?: {
    fullUrl: string | null;
    ipfsCid: string | null;
  };

  collection_id: number;
  collection_name: string;
  collection_cover: string;
  collection_description: string;
}

export interface Collection {
  collection_id: number;
  collection_name: string;
  collection_cover: string;
  date_of_creation: number;
  description: string;
  owner: string;
  owner_mormalized: string;
  owner_can_destroy: boolean;
  token_prefix: string;
  tokens_count: number;
  token_limit: number;
  name: string;
  sponsorship: string;
}
