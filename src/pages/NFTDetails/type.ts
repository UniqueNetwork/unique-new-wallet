import { TokenByIdResponse } from '@unique-nft/sdk';

export type TBaseToken = Pick<
  TokenByIdResponse,
  'tokenId' | 'collectionId' | 'image' | 'owner' | 'video' | 'audio'
> & {
  collectionName?: string;
  name?: string;
  attributes: Record<string, any>;
  file?: any; // TODO: remove after SDK update
};

export type TNestingToken = TBaseToken &
  Partial<Pick<TokenByIdResponse, 'nestingParentToken'>>;
