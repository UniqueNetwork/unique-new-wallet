/* eslint-disable react/jsx-indent-props */

import { ReactNode, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Button, InputText, Select } from '@unique-nft/ui-kit';

import { Direction } from '@app/api/graphQL/types';
import { CollectionsFilter, TypeFilter } from '@app/pages';
import { defaultTypesFilters } from '@app/pages/MyTokens/constants';
import { useNFTsContext } from '@app/pages/MyTokens/context';
import { Option as CollectionOption } from '@app/types';
import { iconDown, iconUp, Option } from '@app/utils';
import { BottomBar, BottomBarHeader } from '@app/pages/components/BottomBar';

export const MobileFilters = ({
  collections,
  resetFilters,
}: {
  collections?: CollectionOption<number>[];
  resetFilters(): void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [search, setSearch] = useState<string>('');
  const { sortByTokenId, searchText, changeSortByTokenId, changeSearchText } =
    useNFTsContext();
  const onVisibleButtonClick = useCallback(() => {
    setIsVisible(true);
  }, [setIsVisible]);

  const onShowButtonClick = useCallback(() => {
    setIsVisible(false);
    changeSearchText(search.trim());
  }, [changeSearchText, search]);

  const onResetButtonClick = useCallback(() => {
    setIsVisible(false);
    resetFilters();
  }, [setIsVisible]);

  const sortByTokenIdHandler = useCallback(({ id }: Option) => {
    changeSortByTokenId(id as Direction);
  }, []);

  const searchHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      changeSearchText(search.trim());
    }
  };

  useEffect(() => {
    setSearch(searchText);
  }, [searchText]);

  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  });

  const barButtons: ReactNode[] = [];

  return (
    <>
      <BottomBar
        header={
          <BottomBarHeader title="Filter and sort" onBackClick={onShowButtonClick} />
        }
        buttons={barButtons}
        isOpen={isVisible}
        parent={document.body}
      >
        <FiltersWrapper>
          <InputText
            iconLeft={{
              color: 'var(--color-blue-grey-500)',
              name: 'magnify',
              size: 18,
            }}
            className="filter-input"
            value={search}
            placeholder="Search"
            onChange={setSearch}
            onKeyDown={searchHandler}
          />
          <Select
            className="filter-input"
            options={[
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
            ]}
            value={sortByTokenId}
            onChange={sortByTokenIdHandler}
          />
          <TypeFilter defaultTypes={defaultTypesFilters} />
          <CollectionsFilter collections={collections} />
        </FiltersWrapper>
      </BottomBar>
    </>
  );
};

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--prop-gap) * 2);
  max-width: 756px;

  .filter-input {
    width: auto;
    max-width: 100%;
  }

  .collections-filter {
    margin: 0;
  }
`;
