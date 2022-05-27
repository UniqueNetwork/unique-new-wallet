import { Api } from '@app/api/restApi/base';
import { CollectionInfo } from '@app/types/Api';

const BASE_URL = '/collection';

export const getCollectionId = (collectionId: string) =>
  Api.get<CollectionInfo>(`${BASE_URL}?collectionId=${collectionId}`);
