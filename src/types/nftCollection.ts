// { key: '_old_offchainSchema', value: '' },
// { key: '_old_schemaVersion', value: 'Unique' },
// { key: '_old_variableOnChainSchema', value: '' },
// { key: '_old_constOnChainSchema', value: JSON.stringify(protobufJson) }
import { ProtobufAttributeType } from '@app/types/minterTypes';

export interface CollectionProperty {
  key: string;
  value: string;
}
//  key: '_old_constData', permission: { collectionAdmin: true, mutable: false, tokenOwner: false }
export interface PropertyPermission {
  collectionAdmin: boolean;
  mutable: boolean;
  tokenOwner: boolean;
}

export interface CollectionPropertyPermission {
  key: string;
  permission: PropertyPermission;
}

export interface CollectionPermissions {
  access?: 'Normal' | 'WhiteList';
  mintMode?: boolean;
  nesting?: {
    owner: string | null;
  };
}

export interface NftCollectionLimits {
  limits?: {
    accountTokenOwnershipLimit?: number;
    sponsoredDataSize?: number;
    sponsoredDataRateLimit?: number;
    sponsoredMintSize?: number;
    tokenLimit?: number;
    sponsorTimeout?: number;
    ownerCanTransfer?: boolean;
    ownerCanDestroy?: boolean;
  };
}

export interface NftCollectionBase extends NftCollectionLimits {
  description: number[];
  mode: {
    nft?: null;
    fungible?: null;
    reFungible?: null;
    invalid?: null;
  };
  name: number[];
  tokenPrefix: number[];
  sponsorship?: {
    confirmed?: string;
    disabled?: string | null;
    unconfirmed?: string | null;
  };
  permissions?: CollectionPermissions;
  properties: CollectionProperty[];
  tokenPropertyPermissions: CollectionPropertyPermission[];
}

export interface CollectionCreateResponse {
  signerPayloadJSON: {
    address: string;
    blockHash: string;
    blockNumber: string;
    era: string;
    genesisHash: string;
    method: string;
    nonce: string;
    specVersion: string;
    tip: string;
    transactionVersion: string;
    signedExtensions: string[];
    version: number;
  };
  signerPayloadRaw: {
    address: string;
    data: string;
    type: number[];
  };
  signerPayloadHex: string;
}

export interface NftCollectionDTO extends NftCollectionLimits {
  address: string;
  description: string;
  metaUpdatePermission: string;
  mode: string;
  name: string;
  properties: {
    offchainSchema: string;
    schemaVersion: string;
    variableOnChainSchema: string;
    constOnChainSchema: ProtobufAttributeType;
  };
  tokenPrefix: string;
  permissions: {
    access: string;
    mintMode: boolean;
    nesting: string;
  };
  tokenPropertyPermissions: {
    constData: {
      mutable: boolean;
      collectionAdmin: boolean;
      tokenOwner: boolean;
    };
  };
}
