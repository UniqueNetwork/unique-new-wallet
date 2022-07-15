import React, { VFC, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import { InputText, Select } from '@unique-nft/ui-kit';

import { ROUTE } from '@app/routes';
import { useAccounts } from '@app/hooks';
import { MintingBtn } from '@app/components';
import { Direction } from '@app/api/graphQL/tokens';
import { iconDown, iconUp, Option } from '@app/utils';
import { useNFTsContext } from '@app/pages/MyTokens/context';

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
      <MintingBtn
        iconLeft={{
          name: 'plus',
          size: 12,
          color: !Number(selectedAccount?.collectionsTotal)
            ? undefined
            : 'var(--color-additional-light)',
        }}
        role="primary"
        title="Create an NFT"
        disabled={!Number(selectedAccount?.collectionsTotal)}
        tooltip={
          !Number(selectedAccount?.collectionsTotal)
            ? 'You need to create first collection before creating NFTs'
            : null
        }
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
