export interface SignerPayloadJSON {
  address: string; // "yGDmrZebghZZtSpK248W6mMmRx9M9CQoRWK6c3VpHVnkWdsAV"
  blockHash: string; // "0x845c05420b02a90e6625b645808cda3baed554e5805edb18f23292c76aba41bd"
  blockNumber: string; // "0x000fc795"
  era: string; // "0x5401"
  genesisHash: string; // "0xcd4d732201ebe5d6b014edda071c4203e16867305332301dc8d092044b28e554"
  method: string; // "0x3d0100000c77007700770010640064006400640010777777770000000100000001000000000000010001010000000100"
  nonce: string; // "0x00000059"
}

export interface ExtrinsicDTO {
  signerPayloadHex: string;
  signerPayloadJSON: SignerPayloadJSON;
  signedExtensions: string[]; // ["CheckSpecVersion", "CheckGenesis", "CheckMortality", "CheckNonce", "CheckWeight", 'CheckWeight']
  specVersion: string; // "0x000e0da8"
  tip: string; // "0x00000000000000000000000000000000"
  transactionVersion: string; // "0x00000001"
  version: number;
  signerPayloadRaw: {
    address: string; // "yGDmrZebghZZtSpK248W6mMmRx9M9CQoRWK6c3VpHVnkWdsAV"
    data: string;
    type: string; // "payload"
  };
}

export interface UnsignedExtrinsicDTO {
  signerPayloadJSON: SignerPayloadJSON;
}

export interface SubmittableExtrinsicDTO extends UnsignedExtrinsicDTO {
  signature: string;
}

export interface SubmitExtrinsicResult {
  hash: string; // '0xac99ae19030f95125daa0466b3b117da843e4e799bb15e853a9b4b0e7c3c82e2'
}

export interface ExtrinsicResultResponse {
  status: string;
  isCompleted: boolean;
  isError: boolean;
  blockHash: string;
  blockIndex: number;
  errorMessage: string;
  events: {
    section: string;
    method: string;
    data: object;
  }[];
}
