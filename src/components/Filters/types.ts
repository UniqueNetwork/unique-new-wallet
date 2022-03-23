export type Statuses = Record<'myNFTs' | 'fixedPrice' | 'timedAuction' | 'myBets', boolean | undefined>

export type PriceRange = {
  minPrice: number
  maxPrice: number
}

export type FilterState = Record<string, number | string | undefined | number[] | boolean>;
