import { createContext, useContext } from 'react';

import { Direction } from '@app/api/graphQL/types';
import { StatusFilterNft, TypeFilterNft } from '@app/api/graphQL/tokens';

export interface TokensContextState {
  sortBy: { [field: string]: Direction };
  changeSort: (sort: { [field: string]: Direction }) => void;
  tokensPage: number;
  changeTokensPage: (page: number) => void;
  statusFilter: StatusFilterNft;
  changeStatusFilter: (statusFilter: StatusFilterNft) => void;
  typeFilter: TypeFilterNft;
  changeTypeFilter: (typeFilter: TypeFilterNft) => void;
  collectionsIds: number[];
  changeCollectionsIds: (collectionsFilters: number) => void;
  setCollectionsIds: (collectionsFilters: number[]) => void;
  searchText: string;
  changeSearchText: (searchText: string) => void;
  clearAll: () => void;
}

const TokensContext = createContext<TokensContextState | null>(null);

export const useTokensContext = () => {
  const context = useContext(TokensContext);

  if (!context) {
    throw new Error(
      'TokensContext value was not provided. Make sure NFTsWrapper exists!',
    );
  }

  return context;
};

export default TokensContext;
