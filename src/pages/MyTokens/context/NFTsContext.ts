import { createContext, useContext } from 'react';

import { Direction } from '@app/api/graphQL/types';
import { TypeFilter } from '@app/api/graphQL/tokens';

export interface NTFsContextState {
  sortByTokenId: Direction;
  changeSortByTokenId: (tokenId: Direction) => void;
  tokensPage: number;
  changeTokensPage: (page: number) => void;
  typesFilters: TypeFilter[];
  changeTypesFilters: (typeFilters: TypeFilter) => void;
  setTypesFilters: (typeFilters: TypeFilter[]) => void;
  collectionsIds: number[];
  changeCollectionsIds: (collectionsFilters: number) => void;
  setCollectionsIds: (collectionsFilters: number[]) => void;
  searchText: string;
  changeSearchText: (searchText: string) => void;
}

const NTFsContext = createContext<NTFsContextState | null>(null);

export const useNFTsContext = () => {
  const context = useContext(NTFsContext);

  if (!context) {
    throw new Error('NTFsContext value was not provided. Make sure NFTsWrapper exists!');
  }

  return context;
};

export default NTFsContext;
