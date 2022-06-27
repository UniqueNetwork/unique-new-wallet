import config from '@app/config';
import { ImagePath } from '@app/api/graphQL';

const { IPFSGateway } = config;

const isImagePath = (value: unknown): value is ImagePath =>
  Object.hasOwn(value as ImagePath, 'ipfs');

export const getTokenIpfsUriByImagePath = (imagePath: string | null): string => {
  if (!imagePath) {
    return '';
  }

  try {
    const deserializedImagePath: unknown = JSON.parse(imagePath);

    if (IPFSGateway && isImagePath(deserializedImagePath) && deserializedImagePath.ipfs) {
      return `${IPFSGateway}/${deserializedImagePath.ipfs}`;
    }
  } catch (error) {
    console.warn(error);
  }

  return '';
};
