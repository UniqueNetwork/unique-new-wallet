import { useEffect, useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import { TOrderBy } from '@app/api';
import { useApi } from '@app/hooks';
import { IconProps, ConfirmBtn, Select } from '@app/components';
import { Direction } from '@app/api/graphQL/types';
import { iconDown, iconUp, Option } from '@app/utils';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { useMyCollectionsContext } from '@app/pages/MyCollections/context';
import { ButtonGroup } from '@app/pages/components/FormComponents';
import { Search } from '@app/pages/components/Search';
import { ControlGroup } from '@app/pages/components/ControlGroup';

type SelectOption = {
  id: string;
  title: string;
  iconRight: IconProps;
};

interface TopFilterComponentProps {
  className?: string;
  showFilter?: boolean;
  view?: 'column' | 'row';
  onCloseFilter?(): void;
}

const sortOptions: SelectOption[] = [
  {
    id: 'collection_id desc',
    title: 'Collection ID',
    iconRight: iconDown,
  },
  {
    id: 'collection_id asc',
    title: 'Collection ID',
    iconRight: iconUp,
  },
  {
    id: 'tokens_count desc',
    title: 'Number of items',
    iconRight: iconDown,
  },
  {
    id: 'tokens_count asc',
    title: 'Number of items',
    iconRight: iconUp,
  },
];

export const TopFilterComponent: VFC<TopFilterComponentProps> = ({
  className,
  showFilter,
  view = 'row',
  onCloseFilter,
}: TopFilterComponentProps) => {
  const navigate = useNavigate();
  const { currentChain } = useApi();
  const [searchString, setSearchString] = useState<string>('');
  const [sort, setSort] = useState<string>('collection_id desc');
  const { onChangeOrder, onChangeSearch, search, order } = useMyCollectionsContext();

  useEffect(() => {
    setSearchString(search);
    const field = Object.keys(order)[0];
    if (field) {
      setSort(`${field} ${Object.values(order)[0]}`);
    }
  }, [search]);

  const onChange = (option: Option) => {
    const filterParam = option.id.split(' ');
    let sortBy: TOrderBy;

    switch (filterParam[0]) {
      case 'tokens_count':
        sortBy = {
          tokens_count: filterParam[1] as Direction,
        };
        break;
      default:
        sortBy = {
          collection_id: filterParam[1] as Direction,
        };
    }

    setSort(option.id);
    onChangeOrder(sortBy);
  };

  const handleSearchString = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.code === 'Enter' && onChangeSearch(searchString);
  };

  const handleSearch = () => {
    onChangeSearch(searchString);
  };

  const handleClear = () => {
    onChangeSearch('');
    setSearchString('');
  };

  const handleApplyFilter = () => {
    handleSearch();
    onCloseFilter?.();
  };

  const onCreateCollection = () => {
    logUserEvent(UserEvents.CREATE_COLLECTION);
    navigate(`/${currentChain?.network}/create-collection/main-information`);
  };

  return (
    <div className={classNames('my-collections-filter', className)}>
      {showFilter && (
        <ControlGroup>
          <Search
            hideButton={view === 'column'}
            value={searchString}
            onChange={setSearchString}
            onKeyDown={handleSearchString}
            onClick={handleSearch}
            onClear={handleClear}
          />
          <Select options={sortOptions} value={sort} onChange={onChange} />
        </ControlGroup>
      )}
      {view === 'row' && (
        <ButtonGroup stack as={ControlsContainer}>
          <ConfirmBtn
            iconLeft={{
              name: 'plus',
              size: 12,
              color: 'currentColor',
            }}
            title="Create a collection"
            role="primary"
            onClick={onCreateCollection}
          />
        </ButtonGroup>
      )}
      {view === 'column' && (
        <FilterButtonsWrapper>
          <ConfirmBtn
            wide
            key="Apply-button-filter"
            title="Apply"
            onClick={handleApplyFilter}
          />
        </FilterButtonsWrapper>
      )}
    </div>
  );
};

const ControlsContainer = styled.div`
  @media screen and (min-width: 1024px) {
    /* margin-left: auto; */
  }
`;

export const TopFilter = styled(TopFilterComponent)`
  box-sizing: border-box;
  flex: 1 1 100%;
  display: flex;
  justify-content: flex-end;
  flex-direction: ${(p) => p.view};
  align-items: center;
  width: 100%;
  gap: var(--prop-gap) calc(var(--prop-gap) * 2);
  padding-bottom: calc(var(--prop-gap) * 2);

  @media screen and (min-width: 1024px) {
    padding-bottom: 0;
  }
`;

const FilterButtonsWrapper = styled.div`
  display: flex;
  position: absolute;
  bottom: var(--prop-gap);
  right: var(--prop-gap);
  left: var(--prop-gap);
`;
