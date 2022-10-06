import { config } from '@app/config';
import { ImagePath } from '@app/api/graphQL/types';

const { IPFSGateway } = config;

const isImagePath = (value: unknown): value is ImagePath =>
  Object.hasOwn(value as ImagePath, 'ipfs');

const isValidHttpUrl = (checkUrl: string): boolean => {
  let url;

  try {
    url = new URL(checkUrl);
  } catch (_) {
    return false;
  }

  return ['http:', 'https:'].includes(url.protocol);
};

/* Могут приходить данные в разных форматах:
 * 1) 'QmbuyQebXVQcZbaGmP4maWUqRiKYeAAyYZEiqL3rnev8i4'
 * 2) https://www.ipfs-server/QmbuyQebXVQcZbaGmP4maWUqRiKYeAAyYZEiqL3rnev8i4
 * 3) "{\"ipfs\":\"QmZCuWx72x1ukhehLsg1qNjKhVj3d1feJjadUPJbyYfmpY\",\"type\":\"image\"}"
 * */
export const getTokenIpfsUriByImagePath = (
  imagePath: string | null | undefined,
): string | undefined => {
  if (!imagePath) {
    return undefined;
  }

  const buildPath = (url: string) => {
    // проверка, что пришла абсолютная ссылка
    if (isValidHttpUrl(url)) {
      return url;
    }
    return `${IPFSGateway}/${url}`;
  };

  try {
    const deserializedImagePath: unknown = JSON.parse(imagePath);

    if (IPFSGateway && isImagePath(deserializedImagePath) && deserializedImagePath.ipfs) {
      return buildPath(deserializedImagePath.ipfs);
    }
  } catch {
    return buildPath(imagePath);
  }

  return undefined;
};

export const shortAddress = (longAddress: string | undefined, slice = 5) => {
  return longAddress
    ? `${longAddress.slice(0, slice)}...${longAddress.slice(-slice)}`
    : '';
};
