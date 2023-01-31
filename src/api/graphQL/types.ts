import { Nullable } from '@app/types';

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

export enum TokenTypeEnum {
  NFT = 'NFT',
  RFT = 'RFT',
}

export interface Token {
  token_id: number;
  token_name: string;
  token_prefix: number;
  owner: string;
  owner_normalized: string;
  attributes: Record<string, Attribute>;
  date_of_creation: number;
  image?: {
    fullUrl: Nullable<string>;
    ipfsCid: Nullable<string>;
  };
  collection_id: number;
  collection_name: string;
  collection_cover: string;
  collection_description: string;
  type: TokenTypeEnum;
  children_count: number;
  parent_id: Nullable<string>;
  nested: boolean;
  total_pieces: string;
}

export interface Collection {
  collection_id: number;
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

export interface RftFraction {
  owner: string;
  amount: string;
  token_id: number;
  collection_id: number;
}
