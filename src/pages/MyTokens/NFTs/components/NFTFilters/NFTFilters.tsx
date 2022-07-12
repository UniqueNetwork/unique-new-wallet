import React, { VFC, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import { Button, InputText, Select } from '@unique-nft/ui-kit';

import { Direction } from '@app/api/graphQL/tokens';
import { iconDown, iconUp, Option } from '@app/utils';
import { useNFTsContext } from '@app/pages/MyTokens/context';
import { ROUTE } from '@app/routes';
import { useAccounts } from '@app/hooks';

interface NFTFiltersComponentProps {
  className?: string;
}

const sortOptions: Option[] = [
  {
    title: 'NFT ID',
    id: 'asc' as Direction,
    iconRight: iconDown,
  },
  {
    title: 'NFT ID',
    id: 'desc' as Direction,
    iconRight: iconUp,
  },
];

const NFTFiltersComponent: VFC<NFTFiltersComponentProps> = ({ className }) => {
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
    <div className={classNames('nft-filters', className)}>
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
      <Button
        role="primary"
        title="Create an NFT"
        iconLeft={{
          name: 'plus',
          size: 12,
          color: 'var(--color-additional-light)',
        }}
        disabled={!Number(selectedAccount?.collectionsTotal)}
        onClick={() => navigate(ROUTE.CREATE_NFT)}
      />
    </div>
  );
};

export const NFTFilters = styled(NFTFiltersComponent)`
  &.nft-filters {
    display: grid;
    grid-template-columns: 502px 268px 183px;
    grid-column-gap: calc(var(--prop-gap) * 2);
    .unique-input-text,
    .unique-select,
    .unique-button {
      width: 100%;
    }
  }
  .unique-select {
    .select-value {
      grid-column-gap: 7px;
    }
  }
`;
