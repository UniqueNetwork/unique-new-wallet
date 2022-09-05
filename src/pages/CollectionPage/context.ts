import { createContext } from 'react';

import { Collection } from '@app/api/graphQL/types';

interface CollectionContextProps {
  collection?: Collection;
  collectionLoading: boolean;
}

export const collectionContext = createContext<CollectionContextProps | null>(null);
