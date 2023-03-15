import keyring from '@polkadot/ui-keyring';
import { Address } from '@unique-nft/utils';

export const getCrossStruct2 = (address: string | undefined) => {
  if (!address) {
    throw new Error('Cant get crossStruct from invalid string');
  }
  const isEth = Address.is.ethereumAddress(address);
  let eth = '';
  let sub = '' as any;
  if (isEth) {
    eth = address;
    sub = '0';
  } else {
    sub = keyring.decodeAddress(address);
    eth = '0x0000000000000000000000000000000000000000';
  }
  return { eth, sub }; // CrossAddressStruct$2
};
