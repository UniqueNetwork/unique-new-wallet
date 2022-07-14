import { Direction } from '@app/api/graphQL/tokens/useGraphQlOwnerTokens';
import { Pagination } from '@app/types';

export type TAttributes = {
  [key: string]: string | string[];
};

export type ImagePath = {
  ipfs: string;
  type: string;
};

export type OptionsTokenCollection = {
  skip?: boolean;
  direction?: Direction;
  pagination: Pagination;
};

export interface TokensVariables {
  limit: number;
  offset: number;
  where?: Record<string, unknown>;
}

export enum TokenType {
  auction = 'Auction', // accepts bids
  minter = 'Minter', // can be purchased directly
  none = 'None', // not on sale
}

export interface ViewToken {
  id: number;
  data: TAttributes;
  token_prefix: string;
  owner: string;
  price: number;
  count_of_views: number;
  collection_cover: string;
  collection_description: string;
  token_name: string;
  token_id: number;
  image_path: string;
  collection_name: string;
  collection_id: number;
}

export type TokenPreviewInfo = Pick<
  ViewToken,
  | 'token_name'
  | 'token_id'
  | 'image_path'
  | 'collection_name'
  | 'collection_id'
  | 'token_prefix'
>;

export type CollectionPreview = Pick<
  ViewToken,
  'collection_id' | 'collection_name' | 'collection_cover'
>;

export interface TokensData {
  view_tokens: ViewToken[];
  view_tokens_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export enum TokenStatus {
  ownedByMe = 'My tokens', // used for "My stuff" page
  myOnSell = 'My NFTs on sell',
  fixedPrice = 'Fixed price',
  timedAuction = 'Timed auction',
  myBets = 'My bets',
}

export interface PriceFilter {
  min: number | undefined;
  max: number | undefined;
}
export interface TokensFilter {
  status: TokenStatus[];
  price: PriceFilter;
  collections: number[] | undefined;
  search: string | undefined;
}

export type useGraphQlTokensProps = {
  pageSize: number;
  filter?: TokensFilter;
  sorting?: { field: keyof ViewToken; direction: 'asc' | 'desc' };
};

export type FetchMoreTokensOptions = {
  filter?: TokensFilter;
  limit?: number;
  offset?: number;
  orderDir?: ['asc', 'dsc'];
};
