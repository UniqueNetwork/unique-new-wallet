import { PaginatedResponse, Pagination, Sortable } from '../base/types';

export type GetOffersRequestPayload = {
  collectionId?: number | number[]
  minPrice?: string
  maxPrice?: string
  seller?: string
  traitsCount?: number[]
  searchText?: string
  searchLocale?: string
} & Pagination & Sortable;

export type Bid = {
  amount: string
  bidderAddress: string
  createdAt: string
  pendingAmount: string
  updatedAt: string
}

export type Auction = {
  bids: Bid[]
  priceStep: string
  startPrice: string
  status: 'created' | '' // ???
  stopAt: string
}

export type Offer = {
  collectionId: number
  tokenId: number
  price: string
  quoteId: number
  seller: string
  creationDate: string
  auction: Auction | null
}

export type OffersResponse = PaginatedResponse<Offer>

export type UseFetchOffersProps = Partial<GetOffersRequestPayload>
