import { MetadataType, NFTCollection } from '../unique/types';
import { hex2a } from './decoder';

const getTokenImageUrl = (urlString: string, tokenId: number): string => {
  if (urlString.indexOf('{id}') !== -1) {
    return urlString.replace('{id}', tokenId.toString());
  }

  return urlString;
};

// uses for token image path
const fetchTokenImage = async (
  collectionInfo: Pick<NFTCollection, 'offchainSchema'>,
  tokenId: number,
): Promise<string> => {
  try {
    const collectionMetadata = JSON.parse(
      hex2a(collectionInfo.offchainSchema),
    ) as MetadataType;

    if (collectionMetadata.metadata) {
      const dataUrl = getTokenImageUrl(collectionMetadata.metadata, tokenId);
      const urlResponse = await fetch(dataUrl);
      const jsonData = (await urlResponse.json()) as { image: string };

      return jsonData.image;
    }
  } catch (e) {
    console.log('image metadata parse error', e);
  }

  return '';
};

export const getTokenImage = async (
  collection: NFTCollection,
  tokenId: number,
): Promise<string> => {
  if (collection.schemaVersion === 'ImageURL') {
    return getTokenImageUrl(hex2a(collection.offchainSchema), tokenId);
  } else {
    return await fetchTokenImage(collection, tokenId);
  }
};
