import { config } from '@app/config';
import { Collection } from '@app/api';

const { IPFSGateway } = config;

export const getCoverURLFromCollection = (
  collection: Collection | undefined,
): string | undefined => {
  if (!collection?.variable_on_chain_schema?.collectionCover) {
    // TODO - get image of the fist token of collection here
    return undefined;
  }

  if (collection?.variable_on_chain_schema?.collectionCover.startsWith('http')) {
    return collection.variable_on_chain_schema?.collectionCover;
  }

  return `${IPFSGateway}/${collection?.variable_on_chain_schema?.collectionCover}`;
};
