import { Api } from '@app/api/restApi/base';
import { CollectionInfoResponse, UnsignedTxPayloadResponse } from '@app/types/Api';

const BASE_URL = '/collection';

export const getCollectionId = (collectionId: string) =>
  Api.get<CollectionInfoResponse>(`${BASE_URL}?collectionId=${collectionId}`);

type TDeleteCollection = {
  collectionId: number;
  address: string;
};

export const deleteCollection = (data: TDeleteCollection) =>
  Api.delete<UnsignedTxPayloadResponse>(BASE_URL, {
    data,
  });
