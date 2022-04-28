import { PaginatedResponse, Pagination } from '../base/types';

export type GetTradesRequestPayload = {
  sortString?: string; // ex. "asc(Price)"
  seller?: string;
  collectionId?: number | number[];
} & Pagination;

export type Trade = {
  buyer: string;
  seller: string;
  collectionId: number;
  creationDate: string;
  metadata: Record<string, any>;
  price: string;
  quoteId: number;
  tokenId: number;
  tradeDate: number;
};

export type TradesResponse = PaginatedResponse<Trade>;

export type UseFetchTradesProps = Partial<GetTradesRequestPayload>;
