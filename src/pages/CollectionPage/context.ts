import { createContext } from 'react';
import { CollectionInfoWithSchemaResponse } from '@unique-nft/sdk';

import { Collection } from '@app/api/graphQL/types';

interface CollectionContextProps {
  collectionSettings?: CollectionInfoWithSchemaResponse;
  collection?: Collection;
  collectionLoading: boolean;
  refetchSettings(): Promise<unknown>;
}

export const collectionContext = createContext<CollectionContextProps | null>(null);
