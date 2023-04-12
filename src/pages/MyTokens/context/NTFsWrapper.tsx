import { FC, useCallback, useState } from 'react';

import { Direction } from '@app/api/graphQL/types';
import { StatusFilterNft, TypeFilterNft } from '@app/api/graphQL/tokens';

import NTFsContext from './NFTsContext';
import { defaultPage } from '../constants';

export const NFTsWrapper: FC = ({ children }) => {
  const [collectionsIds, setCollectionsIds] = useState<number[]>([]);
  const [tokensStatusFilter, setTokensStatusFilter] =
    useState<StatusFilterNft>('allStatus');
  const [sortBy, setSortBy] = useState<Record<string, Direction>>({ token_id: 'asc' });
  const [tokensPage, setTokensPage] = useState(defaultPage);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilterNft>('allType');

  const changeSortByTokenIdHandler = useCallback(
    (sort: { [field: string]: Direction }) => {
      setSortBy(sort);
      setTokensPage(defaultPage);
    },
    [],
  );

  const changeStatusFilterHandler = useCallback((statusFilter: StatusFilterNft) => {
    setTokensStatusFilter(statusFilter);
    setTokensPage(defaultPage);
  }, []);

  const changeTypeFilterHandler = useCallback((typeFilter: TypeFilterNft) => {
    setTypeFilter(typeFilter);
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

  const setCollectionsIdsHandler = useCallback((collectionIds: number[]) => {
    setCollectionsIds(collectionIds);
    setTokensPage(defaultPage);
  }, []);

  const changeSearchTextHandler = useCallback((searchText: string) => {
    setSearchText(searchText);
    setTokensPage(defaultPage);
  }, []);

  return (
    <NTFsContext.Provider
      value={{
        sortBy,
        changeSort: changeSortByTokenIdHandler,
        tokensPage,
        changeTokensPage: setTokensPage,
        statusFilter: tokensStatusFilter,
        changeStatusFilter: changeStatusFilterHandler,
        collectionsIds,
        changeCollectionsIds: changeCollectionsIdsHandler,
        setCollectionsIds: setCollectionsIdsHandler,
        searchText,
        changeSearchText: changeSearchTextHandler,
        typeFilter,
        changeTypeFilter: changeTypeFilterHandler,
      }}
    >
      {children}
    </NTFsContext.Provider>
  );
};
