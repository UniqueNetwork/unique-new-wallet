import { FC, useCallback, useMemo, useState } from 'react';

import { Direction, TypeFilter } from '@app/api/graphQL/tokens';

import NTFsContext from './NFTsContext';
import { defaultPage } from '../constants';

export const NFTsWrapper: FC = ({ children }) => {
  const [collectionsIds, setCollectionsIds] = useState<number[]>([]);
  const [tokensTypesFilters, setTokensTypesFilters] = useState<TypeFilter[]>([]);
  const [sortByTokenId, setSortByTokenId] = useState<Direction>('asc');
  const [tokensPage, setTokensPage] = useState(defaultPage);
  const [searchText, setSearchText] = useState('');

  const changeSortByTokenIdHandler = useCallback((sort: Direction) => {
    setSortByTokenId(sort);
    setTokensPage(defaultPage);
  }, []);

  const changeTypeFiltersHandler = useCallback((typeFilter: TypeFilter) => {
    setTokensTypesFilters((previous) => {
      if (previous.includes(typeFilter)) {
        previous = previous.filter((tf) => tf !== typeFilter);
      } else {
        previous = [...previous, typeFilter];
      }

      return previous;
    });
    setTokensPage(defaultPage);
  }, []);

  const changeCollectionsIdsHandler = useCallback((collectionId: number) => {
    setCollectionsIds((previous) => {
      if (previous.includes(collectionId)) {
        previous = previous.filter((id) => id !== collectionId);
      } else {
        previous = [...previous, collectionId];
      }

      return previous;
    });
    setTokensPage(defaultPage);
  }, []);

  const changeSearchTextHandler = useCallback((searchText: string) => {
    setSearchText(searchText);
    setTokensPage(defaultPage);
  }, []);

  return (
    <NTFsContext.Provider
      value={{
        sortByTokenId,
        changeSortByTokenId: changeSortByTokenIdHandler,
        tokensPage,
        changeTokensPage: setTokensPage,
        typesFilters: tokensTypesFilters,
        changeTypesFilters: changeTypeFiltersHandler,
        collectionsIds,
        changeCollectionsIds: changeCollectionsIdsHandler,
        searchText,
        changeSearchText: changeSearchTextHandler,
      }}
    >
      {children}
    </NTFsContext.Provider>
  );
};
