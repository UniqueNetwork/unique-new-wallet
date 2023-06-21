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
  mintingEnabled: boolean;
  transfersEnabled: boolean;
  burnEnabled: boolean;
  switchingEnabled: boolean;
  subscanAddress: string;
  uniquescanAddress: string;
  marketAddress: string;
}
