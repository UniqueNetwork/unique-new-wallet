import { createQueryKeyStore, inferQueryKeyStore } from '@lukemorales/query-key-factory';

export const queryKeys = createQueryKeyStore({
  account: {
    /*
    necessary to refactor balance query, 
    because below thee keys are used for similar queires
    */
    balance: (address?: string) => [address],
    chain: (baseUrl?: string) => ['balance', baseUrl],
    balances: (addresses: Array<string>) => ['', ...addresses],
  },
  token: {
    byId: (collectionId?: number, tokenId?: number) => [collectionId, tokenId],
    bundle: (collectionId?: number, tokenId?: number) => [collectionId, tokenId],
    isBundle: (collectionId?: number, tokenId?: number) => [collectionId, tokenId],
  },
  collection: {
    byId: (collectionId?: number) => [collectionId],
  },
  chain: {
    properties: null,
  },
});

export type QueryKeys = inferQueryKeyStore<typeof queryKeys>;
