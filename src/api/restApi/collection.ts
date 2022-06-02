import { CollectionInfoResponse, UnsignedTxPayloadResponse } from '@app/types/Api';
import { IBaseApi } from '@app/api';

const BASE_URL = '/collection';

export const getCollectionId = (Api: IBaseApi, collectionId: string) =>
  Api.get<CollectionInfoResponse>(`${BASE_URL}?collectionId=${collectionId}`);

type TDeleteCollection = {
  collectionId: number;
  address: string;
};

export const deleteCollection = (Api: IBaseApi, data: TDeleteCollection) =>
  Api.delete<{ data: UnsignedTxPayloadResponse }>(BASE_URL, {
    data,
  });
