import { createContext } from 'react';

import { CreateCollectionFormType } from '@app/pages/CreateCollection/tabs';

export interface CollectionFormProps {
  data: CreateCollectionFormType | null;
  setCollectionFormData(data: CreateCollectionFormType): void;
}

export const CollectionFormContext = createContext<CollectionFormProps | null>(null);

export default CollectionFormContext;
