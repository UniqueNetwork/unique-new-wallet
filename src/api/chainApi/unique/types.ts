import BN from 'bn.js';

export type SchemaVersionTypes = 'ImageURL' | 'Unique';

export interface NFTCollection {
  id: number;
  access?: 'Normal' | 'WhiteList';
  decimalPoints: BN | number;
  description: number[];
  tokenPrefix: string;
  coverImageUrl: string;
  mintMode?: boolean;
  mode: {
    nft: null;
    fungible: null;
    reFungible: null;
    invalid: null;
  };
  name: number[];
  collectionName: string;
  offchainSchema: string;
  owner?: string;
  schemaVersion: SchemaVersionTypes;
  sponsorship: {
    confirmed?: string;
    disabled?: string | null;
    unconfirmed?: string | null;
  };
  limits?: {
    accountTokenOwnershipLimit: string;
    sponsoredDataSize: string;
    sponsoredDataRateLimit: string;
    sponsoredMintSize: string;
    tokenLimit: string;
    sponsorTimeout: string;
    ownerCanTransfer: boolean;
    ownerCanDestroy: boolean;
  };
  variableOnChainSchema: string;
  constOnChainSchema: string;
}

export type AttributesDecoded = {
  [key: string]: string | string[];
};

export interface NFTToken {
  id: number;
  owner?: { Substrate: string };
  constData?: string;
  variableData?: string;
  attributes: AttributesDecoded;
  imageUrl: string;
  collectionId?: number;
  collectionName?: string;
  prefix?: string;
  description?: string;
  collectionCover?: string;
}

export type MetadataType = {
  metadata?: string;
};
