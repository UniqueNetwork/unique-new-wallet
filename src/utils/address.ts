import { Collection, SchemaVersion } from '@app/api/graphQL';
import config from '@app/config';

const { IPFSGateway } = config;

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
