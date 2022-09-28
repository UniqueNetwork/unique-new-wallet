import React, { useCallback, useEffect, useState, VFC } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { InputText, Select } from '@unique-nft/ui-kit';

import { ROUTE } from '@app/routes';
import { useAccounts, useApi } from '@app/hooks';
import { MintingBtn } from '@app/components';
import { iconDown, iconUp, Option } from '@app/utils';
import { useNFTsContext } from '@app/pages/MyTokens/context';
import { Direction } from '@app/api/graphQL/types';
import { TabsFilter } from '@app/pages/components/TabsFilter';

interface NFTFiltersComponentProps {
  className?: string;
}

const sortOptions: Option[] = [
  {
    title: 'NFT ID',
    id: 'asc' as Direction,
    iconRight: iconUp,
  },
  {
    title: 'NFT ID',
    id: 'desc' as Direction,
    iconRight: iconDown,
  },
];

export const NFTFilters: VFC<NFTFiltersComponentProps> = ({ className }) => {
  const { currentChain } = useApi();
  const [search, setSearch] = useState<string>('');

  const navigate = useNavigate();
  const { sortByTokenId, searchText, changeSortByTokenId, changeSearchText } =
    useNFTsContext();
  const { selectedAccount } = useAccounts();

  const sortByTokenIdHandler = useCallback(({ id }: Option) => {
    changeSortByTokenId(id as Direction);
  }, []);

  useEffect(() => setSearch(searchText), [searchText]);

  const searchHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      changeSearchText(search.trim());
    }
  };

  return (
    <TabsFilter
      buttons={
        <MintingBtn
          iconLeft={{
            name: 'plus',
            size: 12,
            color: 'currentColor',
          }}
          role="primary"
          title="Create an NFT"
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
        <>
          <InputText
            value={search}
            placeholder="Search"
            iconLeft={{ name: 'magnify', size: 18, color: 'var(--color-blue-grey-500)' }}
            onChange={setSearch}
            onKeyDown={searchHandler}
          />
          <Select
            options={sortOptions}
            value={sortByTokenId}
            onChange={sortByTokenIdHandler}
          />
        </>
      }
      className={classNames('nft-filters', className)}
    />
  );
};
