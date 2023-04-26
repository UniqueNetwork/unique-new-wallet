import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Direction } from '@app/api/graphQL/types';
import { StatusFilterNft, TypeFilterNft } from '@app/api/graphQL/tokens';
import { setUrlParameters } from '@app/utils';
import ApiContext from '@app/api/ApiContext';

import TokensContext from './TokensContext';
import { defaultPage, defaultSort } from '../constants';

export const TokensWrapper: FC = ({ children }) => {
  const searchParams = new URLSearchParams(window.location.search);
  const { currentChain } = useContext(ApiContext);
  const chain = useRef<string>(currentChain.network);
  const [collectionsIds, setCollectionsIds] = useState<number[]>(
    searchParams
      .get('collectionsIds')
      ?.split(',')
      .filter((s) => !!s)
      .map(Number) || [],
  );
  const [tokensStatusFilter, setTokensStatusFilter] = useState<StatusFilterNft>(
    (searchParams.get('status') as StatusFilterNft) || 'allStatus',
  );
  const [sortBy, setSortBy] = useState<Record<string, Direction>>(() => {
    const sortBy = searchParams.get('sortBy');
    const [field, direction] = sortBy?.split('|') || [];
    if (field && direction && direction in ['asc', 'desc']) {
      return { [field]: direction as Direction };
    }
    return defaultSort;
  });

  const [tokensPage, setTokensPage] = useState(defaultPage);
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState<TypeFilterNft>(
    (searchParams.get('type') as TypeFilterNft) || 'allType',
  );
  const [isFilterVisible, setFilterVisible] = useState<boolean>(true);

  const changeSort = useCallback((sort: { [field: string]: Direction }) => {
    setSortBy(sort);
    setTokensPage(defaultPage);
    setUrlParameters({ sortBy: `${Object.keys(sort)[0]}|${Object.values(sort)[0]}` });
  }, []);

  const changeStatusFilterHandler = useCallback((statusFilter: StatusFilterNft) => {
    setTokensStatusFilter(statusFilter);
    setTokensPage(defaultPage);

    setUrlParameters({ status: statusFilter });
  }, []);

  const changeTypeFilterHandler = useCallback((typeFilter: TypeFilterNft) => {
    setTypeFilter(typeFilter);
    setTokensPage(defaultPage);

    setUrlParameters({ type: typeFilter });
  }, []);

  const changeCollectionsIdsHandler = useCallback((collectionId: number) => {
    setCollectionsIds((previous) => {
      if (previous.includes(collectionId)) {
        previous = previous.filter((id) => id !== collectionId);
      } else {
        previous = [...previous, collectionId];
      }

      setUrlParameters({ collectionsIds: previous.join(',') });
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
    setUrlParameters({ search: searchText });
  }, []);

  const clearAll = useCallback(() => {
    setTokensStatusFilter('allStatus');
    setTypeFilter('allType');
    setSearchText('');
    setTokensPage(defaultPage);
    setSortBy(defaultSort);
    setCollectionsIds([]);
    setUrlParameters({
      status: 'allStatus',
      type: 'allType',
      search: '',
      sortBy: 'token_id|asc',
      collectionsIds: '',
    });
  }, []);

  useEffect(() => {
    if (currentChain.network !== chain.current) {
      clearAll();
      chain.current = currentChain.network;
    }
  }, [currentChain.network]);

  return (
    <TokensContext.Provider
      value={{
        sortBy,
        changeSort,
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
        clearAll,
        isFilterVisible,
        setFilterVisible,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
};
