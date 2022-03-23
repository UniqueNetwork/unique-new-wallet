import { hexToU8a, isHex, u8aToString } from '@polkadot/util';
import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';

const BYTE_STR_0 = '0'.charCodeAt(0);
const BYTE_STR_X = 'x'.charCodeAt(0);
const STR_NL = '\n';

export const convertToU8a = (result: ArrayBuffer): Uint8Array => {
  const data = new Uint8Array(result);

  // this converts the input (if detected as hex), via the hex conversion route
  if (data[0] === BYTE_STR_0 && data[1] === BYTE_STR_X) {
    let hex = u8aToString(data);

    while (hex[hex.length - 1] === STR_NL) {
      hex = hex.substr(0, hex.length - 1);
    }

    if (isHex(hex)) {
      return hexToU8a(hex);
    }
  }

  return data;
};

export const keyringFromFile = (file: Uint8Array, genesisHash?: string | null): KeyringPair | null => {
  try {
    return keyring.createFromJson(JSON.parse(u8aToString(file)) as KeyringPair$Json, { genesisHash });
  } catch (error) {
    console.error(error);
  }

  return null;
};
