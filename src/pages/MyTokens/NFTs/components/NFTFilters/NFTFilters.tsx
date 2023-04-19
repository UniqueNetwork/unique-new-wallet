import React, { useCallback, useEffect, useState, VFC } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { ROUTE } from '@app/routes';
import { useAccounts, useApi } from '@app/hooks';
import { ConfirmBtn, Select } from '@app/components';
import { Option } from '@app/utils';
import { useNFTsContext } from '@app/pages/MyTokens/context';
import { Direction } from '@app/api/graphQL/types';
import { TabsFilter } from '@app/pages/components/TabsFilter';
import { Search } from '@app/pages/components/Search';
import { ControlGroup } from '@app/pages/components/ControlGroup';

import { sortOptions } from './constants';

interface NFTFiltersComponentProps {
  className?: string;
}

export const NFTFilters: VFC<NFTFiltersComponentProps> = ({ className }) => {
  const { currentChain } = useApi();
  const [search, setSearch] = useState<string>('');

  const navigate = useNavigate();
  const { sortBy, searchText, changeSort, changeSearchText } = useNFTsContext();
  const { selectedAccount } = useAccounts();

  const sortByTokenIdHandler = useCallback(
    ({ sortParam }: Option & { sortParam: { [field: string]: Direction } }) => {
      changeSort(sortParam);
    },
    [],
  );

  useEffect(() => setSearch(searchText), [searchText]);

  const searchHandler = () => {
    changeSearchText(search.trim());
  };
  const clearSearchHandler = () => {
    changeSearchText('');
    setSearch('');
  };

  const keyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      searchHandler();
    }
  };

  return (
    <TabsFilter
      buttons={
        <ConfirmBtn
          iconLeft={{
            name: 'plus',
            size: 12,
            color: 'currentColor',
          }}
          role="primary"
          title="Create a token"
          disabled={!Number(selectedAccount?.collectionsTotal)}
          tooltip={
            !Number(selectedAccount?.collectionsTotal)
              ? 'Please create a collection first'
              : null
          }
          onClick={() => navigate(`/${currentChain?.network}/${ROUTE.CREATE_NFT}`)}
        />
      }
      controls={
        <ControlGroup>
          <Search
            className="filter-search-wrapper"
            value={search}
            onChange={setSearch}
            onKeyDown={keyPressHandler}
            onClear={clearSearchHandler}
            onClick={searchHandler}
          />
          <Select
            options={sortOptions}
            value={`${Object.keys(sortBy)[0]}_${Object.values(sortBy)[0]}`}
            onChange={sortByTokenIdHandler}
          />
        </ControlGroup>
      }
      className={classNames('nft-filters', className)}
    />
  );
};
