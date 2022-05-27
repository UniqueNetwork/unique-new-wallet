import { Api } from '@app/api/restApi/base';
import { CollectionInfo, UnsignedTxPayload } from '@app/types/Api';

const BASE_URL = '/collection';

export const getCollectionId = (collectionId: string) =>
  Api.get<CollectionInfo>(`${BASE_URL}?collectionId=${collectionId}`);

export const deleteCollection = (collectionId: string, addressAccount: string) =>
  Api.delete<UnsignedTxPayload>(BASE_URL);
