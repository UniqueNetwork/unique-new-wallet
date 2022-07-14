import { u8aToHex } from '@polkadot/util';
import { hdLedger } from '@polkadot/util-crypto';
import keyring from '@polkadot/ui-keyring';

export type PairType = 'ecdsa' | 'ed25519' | 'ed25519-ledger' | 'ethereum' | 'sr25519';

export const getSuri = (seed: string, derivePath: string, pairType: PairType): string => {
  return pairType === 'ed25519-ledger'
    ? u8aToHex(hdLedger(seed, derivePath).secretKey.slice(0, 32))
    : pairType === 'ethereum'
    ? `${seed}/${derivePath}`
    : `${seed}${derivePath}`;
};

export const addressFromSeed = (
  seed: string,
  derivePath: string,
  pairType: PairType,
): string => {
  return keyring.createFromUri(
    getSuri(seed, derivePath, pairType),
    {},
    pairType === 'ed25519-ledger' ? 'ed25519' : pairType,
  ).address;
};
