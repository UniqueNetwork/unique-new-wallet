/*
constData example:
  ipfsJson: "{\"ipfs\":\"QmS8YXgfGKgTUnjAPtEf3uf5k4YrFLP2uDcYuNyGLnEiNb\",\"type\":\"image\"}",
  gender: "Male",
  traits: [
    "TEETH_SMILE",
    "UP_HAIR"
  ]
*/
export interface NftTokenConstData {
  [key: string]: string | number | number[] | string[] | null;
}

export interface NftTokenDTO {
  address: string;
  collectionId: number;
  owner: string;
  constData: NftTokenConstData;
}

export interface TokenCreateResponse {
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
