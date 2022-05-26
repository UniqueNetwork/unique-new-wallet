/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ChainProperties {
  /** @example 255 */
  SS58Prefix: number;

  /** @example QTZ */
  token: string;

  /** @example 18 */
  decimals: number;

  /** @example wss://ws-quartz.unique.network */
  wsUrl: string;

  /** @example 0xe9fa5b65a927e85627d87572161f0d86ef65d1432152d59b7a679fb6c7fd3b39 */
  genesisHash: string;
}

export interface TxBuildArgs {
  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;

  /** @example balances */
  section: string;

  /** @example transfer */
  method: string;

  /** @example ["yGEYS1E6fu9YtECXbMFRf1faXRakk3XDLuD1wPzYb4oRWwRJK",100000000] */
  args: any[];
}

export interface SignerPayloadJSONDto {
  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;

  /** The checkpoint hash of the block, in hex */
  blockHash: string;

  /** The checkpoint block number, in hex */
  blockNumber: string;

  /** The era for this transaction, in hex */
  era: string;

  /** The genesis hash of the chain, in hex */
  genesisHash: string;

  /** The encoded method (with arguments) in hex */
  method: string;

  /** The nonce for this transaction, in hex */
  nonce: string;

  /** The current spec version for the runtime */
  specVersion: string;

  /** The tip for this transaction, in hex */
  tip: string;

  /** The current transaction version for the runtime */
  transactionVersion: string;

  /** The applicable signed extensions for this runtime */
  signedExtensions: string[];

  /** The version of the extrinsic we are dealing with */
  version: number;
}

export interface SignerPayloadRawDto {
  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;

  /** The hex-encoded data for this request */
  data: string;

  /** The type of the contained data */
  type: 'bytes' | 'payload';
}

export interface UnsignedTxPayload {
  signerPayloadJSON: SignerPayloadJSONDto;
  signerPayloadRaw: SignerPayloadRawDto;
  signerPayloadHex: string;
}

export interface SignTxArgs {
  signerPayloadHex: string;
}

export interface SignTxResult {
  signature: string;
  signatureType: 'sr25519' | 'ed25519' | 'ecdsa' | 'ethereum';
}

export interface SubmitTxArgs {
  signerPayloadJSON: SignerPayloadJSONDto;
  signature: string;
  signatureType?: 'sr25519' | 'ed25519' | 'ecdsa' | 'ethereum';
}

export interface VerificationResult {
  isValid: boolean;
  errorMessage: string;
}

export interface SubmitResult {
  hash: string;
}

export interface Balance {
  /** @example 411348197000000000000 */
  amount: string;

  /** @example 411.3481 QTZ */
  formatted: string;
}

export interface TransferBuildArgs {
  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  destination: string;

  /** @example 0.01 */
  amount: number;
}

export interface CollectionSponsorship {
  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;
  isConfirmed: boolean;
}

export interface CollectionLimits {
  /** @example null */
  accountTokenOwnershipLimit?: number;

  /** @example null */
  sponsoredDataSize?: number;

  /** @example null */
  sponsoredDataRateLimit?: number;

  /** @example null */
  tokenLimit?: number;

  /** @example null */
  sponsorTransferTimeout?: number;

  /** @example null */
  sponsorApproveTimeout?: number;

  /** @example null */
  ownerCanTransfer?: boolean;

  /** @example null */
  ownerCanDestroy?: boolean;

  /** @example null */
  transfersEnabled?: boolean;
}

export interface CollectionInfo {
  mode?: 'Nft' | 'Fungible' | 'ReFungible';
  access?: 'Normal' | 'AllowList';
  schemaVersion?: 'ImageURL' | 'Unique';

  /** @example Sample collection name */
  name: string;

  /** @example sample collection description */
  description: string;

  /** @example TEST */
  tokenPrefix: string;
  mintMode?: boolean;

  /** @example https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png */
  offchainSchema?: string;
  sponsorship?: CollectionSponsorship;
  limits?: CollectionLimits;

  /** @example {"nested":{"onChainMetaData":{"nested":{"NFTMeta":{"fields":{"ipfsJson":{"id":1,"rule":"required","type":"string"}}}}}}} */
  constOnChainSchema?: object;
  variableOnChainSchema?: object;
  metaUpdatePermission?: 'ItemOwner' | 'Admin' | 'None';

  /** @example 1 */
  id: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  owner: string;

  /** @example 100 */
  tokensCount: number;
}

export interface CreateCollectionArgs {
  mode?: 'Nft' | 'Fungible' | 'ReFungible';
  access?: 'Normal' | 'AllowList';
  schemaVersion?: 'ImageURL' | 'Unique';

  /** @example Sample collection name */
  name: string;

  /** @example sample collection description */
  description: string;

  /** @example TEST */
  tokenPrefix: string;
  mintMode?: boolean;

  /** @example https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image{id}.png */
  offchainSchema?: string;
  sponsorship?: CollectionSponsorship;
  limits?: CollectionLimits;

  /** @example {"nested":{"onChainMetaData":{"nested":{"NFTMeta":{"fields":{"ipfsJson":{"id":1,"rule":"required","type":"string"}}}}}}} */
  constOnChainSchema?: object;
  variableOnChainSchema?: object;
  metaUpdatePermission?: 'ItemOwner' | 'Admin' | 'None';

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;
}

export interface BurnCollectionArgs {
  /** @example 1 */
  collectionId: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;
}

export interface TransferCollectionArgs {
  collectionId: number;
  from: string;
  to: string;
}

export interface TokenInfoDto {
  /** @example 1 */
  id: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  owner: string;

  /** @example 1 */
  collectionId: number;

  /** @example {"ipfsJson":"{\"ipfs\":\"QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb\",\"type\":\"image\"}","gender":"Male","traits":["TEETH_SMILE","UP_HAIR"]} */
  constData: object;

  /**
   * URL of the token content on IPFS node (if available)
   * @example https://ipfs.unique.network/ipfs/QmcAcH4F9HYQtpqKHxBFwGvkfKb8qckXj2YWUrcc8yd24G/image1.png
   */
  url: string;
}

export interface CreateTokenArgs {
  /** @example 1 */
  collectionId: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;

  /** @example {"ipfsJson":"{\"ipfs\":\"QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb\",\"type\":\"image\"}","gender":"Male","traits":["TEETH_SMILE","UP_HAIR"]} */
  constData: object;
}

export interface BurnTokenArgs {
  /** @example 1 */
  collectionId: number;

  /** @example 1 */
  tokenId: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  address: string;
}

export interface TransferTokenArgs {
  /** @example 1 */
  collectionId: number;

  /** @example 1 */
  tokenId: number;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  from: string;

  /**
   * The ss-58 encoded address
   * @example yGCyN3eydMkze4EPtz59Tn7obwbUbYNZCz48dp8FRdemTaLwm
   */
  to: string;
}
