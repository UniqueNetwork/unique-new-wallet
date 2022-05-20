export type Offer = {
  collectionId: number;
  tokenId: number;
  price: string;
  quoteId: number;
  seller: string;
  creationDate: string;
};

export type Chain = {
  apiEndpoint: string;
  name: string;
  network: string;
};
