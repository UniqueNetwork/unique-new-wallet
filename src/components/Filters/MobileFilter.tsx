import { Button, Heading, InputText, Select } from '@unique-nft/ui-kit';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';

import { Direction } from '@app/api/graphQL/types';
import { CollectionsFilter, TypeFilter } from '@app/pages';
import { defaultTypesFilters } from '@app/pages/MyTokens/constants';
import { useNFTsContext } from '@app/pages/MyTokens/context';
import { Option as CollectionOption } from '@app/types';
import { iconDown, iconUp, Option } from '@app/utils';

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
      console.log('enter', search);
    }
  };

  useEffect(() => {
    setSearch(searchText);
  }, [searchText]);

  return (
    <>
      <MobileFilterActionsWrapper>
        {!isVisible && (
          <FilterButton
            role="primary"
            title="Filter and sort"
            onClick={onVisibleButtonClick}
          />
        )}
        {isVisible && (
          <FilterControls>
            <Button title="Apply" onClick={onShowButtonClick} />
            <Button role="danger" title="Reset All" onClick={onResetButtonClick} />
          </FilterControls>
        )}
      </MobileFilterActionsWrapper>
      {isVisible && (
        <MobileFilterModal>
          <HeadingH2 size="2">Filter and sort</HeadingH2>
          <Button
            iconLeft={{
              color: 'var(--color-grey-500)',
              name: 'arrow-left',
              size: 12,
            }}
            link="#"
            role="ghost"
            size="small"
            title="back"
            className="back-button"
            onClick={onShowButtonClick}
          />
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
        </MobileFilterModal>
      )}
    </>
  );
};

const MobileFilterActionsWrapper = styled.div`
  display: none;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  background-color: var(--color-additional-light);
  box-shadow: 0px -8px 12px rgba(0, 0, 0, 0.06);
  z-index: 8;
  column-gap: calc(var(--prop-gap) / 2);
  @media (max-width: 1279px) {
    display: flex;
  }
`;

const FilterButton = styled(Button)`
  margin: 10px 16px;
  @media (max-width: 568px) {
    width: 100%;
  }
`;

const FilterControls = styled.div`
  margin: 10px 16px;
  display: flex;
  gap: 10px;
  button {
    width: 140px;
  }
`;

const MobileFilterModal = styled.div`
  display: none;
  position: fixed;
  background-color: var(--color-additional-light);
  padding: calc(var(--prop-gap) * 1.5);
  height: calc(100vh - 180px);
  top: 80px;
  right: 0;
  left: 0;
  overflow-y: auto;

  @media (max-width: 1279px) {
    display: block;
  }

  .back-button {
    padding: 0px;
  }
`;

const HeadingH2 = styled(Heading)`
  margin-bottom: 8px !important;
`;

const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 32px;
  max-width: 750px;
  .filter-input {
    max-width: 100%;
    width: unset;
  }
`;
