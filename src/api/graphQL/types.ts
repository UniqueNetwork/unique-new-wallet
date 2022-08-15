export interface QueryResponse<TData = void> {
  [key: string]: {
    count?: number;
    data?: TData[];
  };
}

export interface Attribute {
  name: { _: string };
  value: { _: string };
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
  image: {
    fullUrl: string;
    ipfsCid: string;
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
}
