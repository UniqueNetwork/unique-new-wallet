import keyring from '@polkadot/ui-keyring';
import { BN } from '@polkadot/util';
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

export const amountToBnHex = (value: string, decimals: number): string => {
  if (!value || !value.length) {
    return '0';
  }

  const numStringValue = value.replace(',', '.');
  const [left, right] = numStringValue.split('.');
  const decimalsFromLessZeroString = right?.length || 0;
  const bigValue = [...(left || []), ...(right || [])].join('').replace(/^0+/, '');
  return (
    '0x' +
    new BN(bigValue)
      .mul(new BN(10).pow(new BN(decimals - decimalsFromLessZeroString)))
      .toString('hex')
  );
};
