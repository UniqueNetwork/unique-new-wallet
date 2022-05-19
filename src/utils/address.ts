import { Collection, SchemaVersion } from '@app/api/graphQL';

const IPFS_GATEWAY =
  window.ENV?.REACT_APP_IPFS_GATEWAY || process.env.REACT_APP_IPFS_GATEWAY;

export const getCollectionCoverUri = (collection: Collection): string => {
  const defaultCollectionCoverId = '1';
  const covers = new Map<SchemaVersion, string | null>([
    ['ImageURL', collection.offchain_schema.replace('{id}', defaultCollectionCoverId)],
    [
      'Unique',
      IPFS_GATEWAY && collection?.variable_on_chain_schema?.collectionCover
        ? `${IPFS_GATEWAY}/${collection.variable_on_chain_schema.collectionCover}`
        : null,
    ],
  ]);

  return covers.get(collection.schema_version) ?? '';
};
