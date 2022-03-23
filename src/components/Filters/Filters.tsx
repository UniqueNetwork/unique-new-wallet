import React, { FC, useCallback } from 'react';
import styled from 'styled-components/macro';

import StatusFilter from './StatusFilter';
import PricesFilter from './PricesFilter';
import { FilterState, PriceRange, Statuses } from './types';
import CollectionsFilter from './CollectionsFilter';
import { useAccounts } from '../../hooks/useAccounts';

type FiltersProps = {
  onFilterChange(value: FilterState): void
}

export const Filters: FC<FiltersProps> = ({ onFilterChange }) => {
  const { selectedAccount } = useAccounts();

  const onStatusFilterChange = useCallback((value: Statuses) => {
    const newFilter = {
      seller: value.myNFTs ? selectedAccount?.address : undefined
    };
    onFilterChange(newFilter);
  }, [onFilterChange]);

  const onPricesFilterChange = useCallback((value: PriceRange | undefined) => {
    const { minPrice, maxPrice } = (value as PriceRange) || {};
    const newFilter = { minPrice, maxPrice };
    onFilterChange(newFilter);
  }, [onFilterChange]);

  const onCollectionsFilterChange = useCallback((value: number[]) => {
    const newFilter = { collectionId: value };
    onFilterChange(newFilter);
  }, [onFilterChange]);

  return <FiltersStyled>
    <StatusFilter onChange={onStatusFilterChange}/>
    <PricesFilter onChange={onPricesFilterChange} />
    <CollectionsFilter onChange={onCollectionsFilterChange} />
  </FiltersStyled>;
};

const FiltersStyled = styled.div`
  width: 235px;
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--gap) * 2);
`;
