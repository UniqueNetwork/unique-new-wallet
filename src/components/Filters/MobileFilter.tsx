import { ReactNode, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import { Direction } from '@app/api/graphQL/types';
import { CollectionsFilter, StatusFilter, TypeFilter } from '@app/pages';
import { defaultStatusFilter, defaultTypeFilter } from '@app/pages/MyTokens/constants';
import { useNFTsContext } from '@app/pages/MyTokens/context';
import { OptionChips as CollectionOption } from '@app/types';
import { iconDown, iconUp, Option } from '@app/utils';
import { Search } from '@app/pages/components/Search';
import { BottomBar, BottomBarHeader } from '@app/pages/components/BottomBar';
import { SortOption } from '@app/pages/MyTokens/NFTs/components/NFTFilters/types';

import { Button, Select } from '../';

export const MobileFilters = ({
  collections,
  sortOptions,
  resetFilters,
}: {
  collections?: CollectionOption<number>[];
  sortOptions?: SortOption[];
  resetFilters(): void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [search, setSearch] = useState<string>('');
  const { sortBy, searchText, changeSort, changeSearchText } = useNFTsContext();
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

  const sortByTokenIdHandler = useCallback(({ sortParam }: SortOption) => {
    changeSort(sortParam);
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

  const barButtons: ReactNode[] = [
    <Button
      key="Filter-toggle-button"
      role="primary"
      title="Filter and sort"
      onClick={onVisibleButtonClick}
    />,
  ];

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
          <Search
            className="filter-input"
            value={search}
            onChange={setSearch}
            onKeyDown={searchHandler}
          />
          <Select
            className="filter-input"
            options={sortOptions || []}
            value={`${Object.keys(sortBy)[0]}_${Object.values(sortBy)[0]}`}
            onChange={sortByTokenIdHandler}
          />
          <StatusFilter status={defaultStatusFilter} />
          <TypeFilter type={defaultTypeFilter} />
          <CollectionsFilter collections={collections} />
        </FiltersWrapper>
        <ButtonsGroup>
          <Button key="Filter-apply-button" title="Apply" onClick={onShowButtonClick} />
          <Button
            key="Filter-reset-button"
            role="danger"
            title="Reset All"
            onClick={onResetButtonClick}
          />
        </ButtonsGroup>
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

const ButtonsGroup = styled.div`
  position: absolute;
  bottom: 0;
  padding: calc(var(--prop-gap) / 1.6) calc(var(--prop-gap) / 2);
  display: flex;
  gap: calc(var(--prop-gap) / 2);
  left: 0;
  right: 0;
  button {
    flex: 1 1;
  }
  @media screen and (min-width: 568px) {
    button {
      flex: unset;
    }
  }
`;
