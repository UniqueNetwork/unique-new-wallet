import { INetwork } from '@app/types';

export type Offer = {
  collectionId: number;
  tokenId: number;
  price: string;
  quoteId: number;
  seller: string;
  creationDate: string;
};

export interface Chain extends INetwork {
  apiEndpoint: string;
}
