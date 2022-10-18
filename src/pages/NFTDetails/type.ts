import { TokenByIdResponse } from '@unique-nft/sdk';

export type TToken = Pick<
  TokenByIdResponse,
  'tokenId' | 'collectionId' | 'image' | 'owner'
> & {
  collectionName: string;
  name: string;
  attributes: Record<string, any>;
};
