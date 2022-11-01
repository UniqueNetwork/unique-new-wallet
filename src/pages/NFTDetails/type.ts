import { TokenByIdResponse } from '@unique-nft/sdk';

export type TBaseToken = Pick<
  TokenByIdResponse,
  'tokenId' | 'collectionId' | 'image' | 'owner'
> & {
  collectionName?: string;
  name?: string;
  attributes: Record<string, any>;
};

export type TNestingToken = TBaseToken &
  Partial<Pick<TokenByIdResponse, 'nestingParentToken'>>;
