export type Offer = {
  collectionId: number;
  tokenId: number;
  price: string;
  quoteId: number;
  seller: string;
  creationDate: string;
};

export interface Chain {
  apiEndpoint: string;
  gqlEndpoint: string;
  network: string;
  name: string;
}
