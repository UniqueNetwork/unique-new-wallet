import { CollectionCreateMutation } from './CollectionCreateMutation';
import { CollectionQuery } from './CollectionQuery';

export class CollectionApiService {
  static collectionCreateMutation = new CollectionCreateMutation();
  static collectionQuery = new CollectionQuery();
}
