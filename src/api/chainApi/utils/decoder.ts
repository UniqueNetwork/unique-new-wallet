import { AttributesDecoded, NFTCollection } from '../unique/types';
import { deserializeNft, ProtobufAttributeType } from './protobufUtils';
import { addressToEvm } from '@polkadot/util-crypto';

export const collectionName16Decoder = (name: number[]) => {
  const collectionNameArr = name.map((item: number) => item);

  return String.fromCharCode(...collectionNameArr);
};

export const collectionName8Decoder = (name: number[]) => {
  const collectionNameArr = Array.prototype.slice.call(name);

  return String.fromCharCode(...collectionNameArr);
};

export const hex2a = (hexx: string) => {
  const hex: string = hexx.substring(2);
  let str = '';

  for (let i = 0; i < hex.length && hex.substr(i, 2) !== '00'; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  return str;
};

export const decodeStruct = ({ attr, data }: { attr?: any; data?: string }): AttributesDecoded => {
  if (attr && data) {
    try {
      const schema = JSON.parse(attr) as ProtobufAttributeType;

      if (schema?.nested) {
        return deserializeNft(schema, Buffer.from(data.slice(2), 'hex'), 'en');
      }
    } catch (e) {
      console.log('decodeStruct error', e);
    }
  }

  return {};
};

export const getOnChainSchema = (collection: NFTCollection): {
  attributesConst: string
  attributesVar: string
} => {
  if (collection) {
    return {
      attributesConst: hex2a(collection.constOnChainSchema),
      attributesVar: hex2a(collection.variableOnChainSchema)
    };
  }

  return {
    attributesConst: '',
    attributesVar: ''
  };
};

// decimals: 15 - opal, 18 - eth
export const subToEthLowercase = (eth: string): string => { // TODO: why args called eth!?
  const bytes = addressToEvm(eth);

  return '0x' + Buffer.from(bytes).toString('hex');
};
