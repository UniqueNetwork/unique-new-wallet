import { createQueryKeyStore, inferQueryKeyStore } from '@lukemorales/query-key-factory';

export const queryKeys = createQueryKeyStore({
  account: {
    /*
    necessary to refactor balance query, 
    because below thee keys are used for similar queires
    */
    balance: (address?: string) => [address],
    chain: (baseUrl?: string) => ['balance', baseUrl],
    withdraw: (baseUrl?: string) => ['withdaw', baseUrl],
  },
  token: {
    byId: (collectionId?: number, tokenId?: number) => [collectionId, tokenId],
    bundle: (collectionId?: number, tokenId?: number) => [collectionId, tokenId],
    isBundle: (collectionId?: number, tokenId?: number) => [collectionId, tokenId],
    parent: (collectionId?: number, tokenId?: number) => [collectionId, tokenId],
    owner: (collectionId?: number, tokenId?: number) => [collectionId, tokenId],
    balance: (collectionId?: number, tokenId?: number, owner?: string) => [
      collectionId,
      tokenId,
      owner,
    ],
  },
  collection: {
    byId: (collectionId?: number) => [collectionId],
  },
  chain: {
    properties: (baseUrl?: string) => ['property', baseUrl],
  },
});

export type QueryKeys = inferQueryKeyStore<typeof queryKeys>;
