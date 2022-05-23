import { Collection, ImagePath, SchemaVersion } from '@app/api/graphQL';
import config from '@app/config';

const { IPFSGateway } = config;

const isImagePath = (value: unknown): value is ImagePath =>
  Object.hasOwn(value as ImagePath, 'ipfs');

export const getTokenIpfsUriByImagePath = (imagePath: string): string => {
  const deserializedImagePath: unknown = JSON.parse(imagePath);

  if (IPFSGateway && isImagePath(deserializedImagePath) && deserializedImagePath.ipfs)
    return `${IPFSGateway}/${deserializedImagePath.ipfs}`;

  return '';
};

export const getCollectionCoverUri = (collection: Collection): string => {
  const defaultCollectionCoverId = '1';
  const covers = new Map<SchemaVersion, string | null>([
    ['ImageURL', collection.offchain_schema.replace('{id}', defaultCollectionCoverId)],
    [
      'Unique',
      IPFSGateway && collection?.variable_on_chain_schema?.collectionCover
        ? `${IPFSGateway}/${collection.variable_on_chain_schema.collectionCover}`
        : null,
    ],
  ]);

  return covers.get(collection.schema_version) ?? '';
};
