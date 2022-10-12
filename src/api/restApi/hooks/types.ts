import { IBaseApi } from '@app/api';

export type Payload<TBody> = {
  api: IBaseApi;
  body: TBody;
};

export type TExtrinsicType =
  | 'create-token'
  | 'create-collection'
  | 'burn-token'
  | 'burn-collection'
  | 'transfer-token'
  | 'transfer-balance';

export type TCollectionsCacheVar = { collectionId: number; path: string | undefined }[];
export type TTokensCacheVar = {
  tokenId: number;
  collectionId: number;
  path: string | undefined;
}[];
