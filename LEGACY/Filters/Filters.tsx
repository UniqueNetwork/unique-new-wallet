import React, { Dispatch, FC, SetStateAction, useCallback } from 'react';
import styled from 'styled-components/macro';

import PricesFilter from '../../../components/Filters/PricesFilter';
import { PriceRange } from '@app/components/Filters/types';
import CollectionsFilter from '../../../components/Filters/CollectionsFilter';
import { MyTokensStatuses } from './types';
import StatusFilter from './StatusFilter';
import { FilterChangeHandler } from '@app/components/Filters/MobileFilter';

export type MyTokensFilterState = Partial<MyTokensStatuses> & Partial<PriceRange> & { collectionIds?: number[] }

type FiltersProps = {
  onFilterChange: FilterChangeHandler<MyTokensFilterState>
}

export const Filters: FC<FiltersProps> = ({ onFilterChange }) => {
  const onStatusFilterChange = useCallback((value: MyTokensStatuses) => {
    (onFilterChange as Dispatch<SetStateAction<MyTokensFilterState | null>>)((filters) => ({ ...filters, ...value }));
  }, [onFilterChange]);

  const onPricesFilterChange = useCallback((value: PriceRange | undefined) => {
    const { minPrice, maxPrice } = (value as PriceRange) || {};
    (onFilterChange as Dispatch<SetStateAction<MyTokensFilterState | null>>)((filters) => ({ ...filters, minPrice, maxPrice }));
  }, [onFilterChange]);

  const onCollectionsFilterChange = useCallback((collectionIds: number[]) => {
    (onFilterChange as Dispatch<SetStateAction<MyTokensFilterState | null>>)((filters) => ({ ...filters, collectionIds }));
  }, [onFilterChange]);

  const onStatusFilterClear = useCallback(() => {
    (onFilterChange as Dispatch<SetStateAction<MyTokensFilterState | null>>)((filters) => ({ ...filters }));
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
