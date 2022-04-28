import { encodeAddress, ethereumEncode } from '@polkadot/util-crypto';
import { assert, hexToU8a, isHex } from '@polkadot/util';
import { AccountId } from '@polkadot/types/interfaces';
import { IKeyringPair } from '@polkadot/types/types';
import { keyring } from '@polkadot/ui-keyring';
import Web3 from 'web3';

import { subToEthLowercase } from './decoder';
import { CrossAccountId } from '../types';

keyring.loadAll({});

export const compareEncodedAddresses = (
  subAddress1: string,
  subAddress2: string,
): boolean => {
  if (!subAddress1 || !subAddress2) return false;
  return encodeAddress(subAddress1) === encodeAddress(subAddress2);
};

export const getEthAccount = (account: string) => {
  if (!account) throw new Error('Account was not provided');
  const ethAccount = Web3.utils.toChecksumAddress(subToEthLowercase(account));
  return ethAccount.toLowerCase();
};

export const isTokenOwner = (
  account: string,
  tokenOwner: { Substrate?: string; Ethereum?: string },
): boolean => {
  const ethAccount = getEthAccount(account);
  const normalizeSubstrate = toAddress(tokenOwner.Substrate);

  return (
    normalizeSubstrate === account || tokenOwner.Ethereum?.toLowerCase() === ethAccount
  );
};

export function normalizeAccountId(
  input: string | AccountId | CrossAccountId | IKeyringPair,
): CrossAccountId {
  if (typeof input === 'string') {
    if (input.length === 48 || input.length === 47) {
      return { Substrate: input };
    } else if (input.length === 42 && input.startsWith('0x')) {
      return { Ethereum: input.toLowerCase() };
    } else if (input.length === 40 && !input.startsWith('0x')) {
      return { Ethereum: '0x' + input.toLowerCase() };
    } else {
      throw new Error(`Unknown address format: "${input}"`);
    }
  }

  if ('address' in input) {
    return { Substrate: input.address };
  }

  if ('Ethereum' in input) {
    return {
      Ethereum: input.Ethereum.toLowerCase(),
    };
  } else if ('ethereum' in input) {
    return {
      Ethereum: (input as { ethereum: string }).ethereum.toLowerCase(),
    };
  } else if ('Substrate' in input) {
    return input;
  } else if ('substrate' in input) {
    return {
      Substrate: (input as { substrate: string }).substrate,
    };
  }

  // AccountId
  return { Substrate: input.toString() };
}

export function toAddress(
  value?: string | Uint8Array | null,
  allowIndices = false,
): string | undefined {
  if (value) {
    try {
      const u8a = isHex(value) ? hexToU8a(value) : keyring.decodeAddress(value);

      assert(
        allowIndices || u8a.length === 32 || u8a.length === 20,
        'AccountIndex values not allowed',
      );

      if (u8a.length === 20) {
        return ethereumEncode(u8a);
      } else {
        return keyring.encodeAddress(u8a);
      }
    } catch (error) {
      console.log(error);
      // noop, undefined return indicates invalid/transient
    }
  }

  return undefined;
}
