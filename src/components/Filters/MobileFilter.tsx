import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import styled from 'styled-components/macro';
import { Button, Select, Tabs, IconProps } from '@unique-nft/ui-kit';
import { SelectOptionProps } from '@unique-nft/ui-kit/dist/cjs/types';

import { FilterState } from './types';

export type FilterChangeHandler<T> =
  | Dispatch<SetStateAction<T | null>>
  | ((value: T | null) => void);

type FiltersProps<T> = {
  defaultSortingValue: SelectOptionProps;
  sortingValue: string;
  sortingOptions: {
    id: string;
    title: string;
    iconRight?: IconProps;
  }[];
  onFilterChange: FilterChangeHandler<T>;
  onSortingChange(value: SelectOptionProps): void;
  filterComponent?: (props: {
    onFilterChange: FilterChangeHandler<T>;
  }) => ReactElement | null;
};

const tabs = ['Filter', 'Sort'];

export function MobileFilters<T = FilterState>({
  filterComponent,
  defaultSortingValue,
  sortingValue,
  sortingOptions,
  onFilterChange,
  onSortingChange,
}: FiltersProps<T>) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const onVisibleButtonClick = useCallback(() => {
    setIsVisible(true);
  }, [setIsVisible]);

  const onShowButtonClick = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  const onResetButtonClick = useCallback(() => {
    setIsVisible(false);
    onFilterChange(null);
    onSortingChange(defaultSortingValue);
  }, [setIsVisible]);

  return (
    <>
      <MobileFilterActionsWrapper>
        {!isVisible && (
          <Button
            role={'primary'}
            title={'Filter and sort'}
            onClick={onVisibleButtonClick}
          />
        )}
        {isVisible && (
          <>
            <Button title={'Show'} onClick={onShowButtonClick} />
            <Button role={'danger'} title={'Reset'} onClick={onResetButtonClick} />
          </>
        )}
      </MobileFilterActionsWrapper>
      {isVisible && (
        <MobileFilterModal>
          <Tabs activeIndex={activeTabIndex} labels={tabs} onClick={setActiveTabIndex} />
          <Tabs activeIndex={activeTabIndex}>
            {(filterComponent && filterComponent({ onFilterChange })) || <></>}
            <SortStyled>
              <Select
                options={sortingOptions}
                value={sortingValue}
                onChange={onSortingChange}
              />
            </SortStyled>
          </Tabs>
        </MobileFilterModal>
      )}
    </>
  );
}

const MobileFilterActionsWrapper = styled.div`
  display: none;
  position: fixed;
  top: calc(100vh - 60px);
  width: 100%;
  left: 0;
  padding: 10px calc(var(--prop-gap) * 1.5);
  background-color: var(--color-additional-light);
  box-shadow: 0px -8px 12px rgba(0, 0, 0, 0.06);
  z-index: 8;
  column-gap: calc(var(--prop-gap) / 2);
  @media (max-width: 1024px) {
    display: flex;
  }
`;

const MobileFilterModal = styled.div`
  display: none;
  position: fixed;
  background-color: var(--color-additional-light);
  padding: calc(var(--prop-gap) * 1.5);
  height: calc(100vh - 140px);
  top: 80px;
  right: 0;
  left: 0;
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const SortStyled = styled.div`
  width: 235px;
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--prop-gap) * 2);
`;
