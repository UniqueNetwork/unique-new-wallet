import { createContext } from 'react';
import { CollectionInfoWithSchemaResponse, LastTokenIdResultDto } from '@unique-nft/sdk';

import { Collection } from '@app/api/graphQL/types';

interface CollectionContextProps {
  collectionSettings?: CollectionInfoWithSchemaResponse;
  collection?: Collection;
  lastToken?: LastTokenIdResultDto;
  collectionLoading: boolean;
  refetchSettings(): Promise<unknown>;
}

export const collectionContext = createContext<CollectionContextProps | null>(null);
