import { CollectionInfo } from '@app/types/Api';
import { IBaseApi } from '@app/api';

const BASE_URL = '/collection';

export const getCollectionId = (Api: IBaseApi, collectionId: string) =>
  Api.get<CollectionInfo>(`${BASE_URL}?collectionId=${collectionId}`);
