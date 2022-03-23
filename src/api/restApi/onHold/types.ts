import { PaginatedResponse, Pagination } from '../base/types';

export type GetOnHoldRequestPayload = {
  owner?: string;
  collectionId?: number | number[]
} & Pagination;

export type OnHold = {
  owner: string
  collectionId: number
  tokenId: number
}

export type OnHoldResponse = PaginatedResponse<OnHold>

export type UseFetchOnHoldProps = Partial<GetOnHoldRequestPayload>
