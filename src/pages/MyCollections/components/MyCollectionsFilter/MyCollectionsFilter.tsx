import React, { useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Button, IconProps, InputText, Select } from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { TOrderBy } from '@app/api';
import { iconDown, iconUp, Option } from '@app/utils';
import { PaddedBlock } from '@app/styles/styledVariables';
import { Direction } from '@app/api/graphQL/tokens';
import { useMyCollectionsContext } from '@app/pages/MyCollections/context';
import { useApi } from '@app/hooks';

type SelectOption = {
  id: string;
  title: string;
  iconRight: IconProps;
};

interface MyCollectionsFilterComponentProps {
  className?: string;
}

const sortOptions: SelectOption[] = [
  {
    id: 'collection desc',
    title: 'Collection ID',
    iconRight: iconDown,
  },
  {
    id: 'collection asc',
    title: 'Collection ID',
    iconRight: iconUp,
  },
  {
    id: 'items desc',
    title: 'items',
    iconRight: iconDown,
  },
  {
    id: 'items asc',
    title: 'items',
    iconRight: iconUp,
  },
];

export const MyCollectionsFilterComponent: VFC<MyCollectionsFilterComponentProps> = ({
  className,
}) => {
  const navigate = useNavigate();
  const { currentChain } = useApi();
  const [searchString, setSearchString] = useState<string>('');
  const [sort, setSort] = useState<string>('collection desc');
  const { onChangeOrder, onChangeSearch } = useMyCollectionsContext();

  const onChange = (option: Option) => {
    const filterParam = option.id.split(' ');
    let sortBy: TOrderBy;

    switch (filterParam[0]) {
      case 'items':
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

  const onCreateCollection = () => {
    navigate(`/${currentChain?.network}/create-collection/main-information`);
  };

  return (
    <div className={classNames('my-collections-filter', className)}>
      <LeftColumn>
        <InputText
          iconLeft={{ name: 'magnify', size: 18, color: 'var(--color-blue-grey-500)' }}
          value={searchString}
          onChange={setSearchString}
          onKeyDown={handleSearchString}
        />
        <Select options={sortOptions} value={sort} onChange={onChange} />
      </LeftColumn>
      <Button
        iconLeft={{
          name: 'plus',
          size: 12,
          color: 'var(--color-additional-light)',
        }}
        title="Create collection"
        role="primary"
        onClick={onCreateCollection}
      />
    </div>
  );
};

export const LeftColumn = styled.div`
  display: grid;
  grid-template-columns: 502px 268px;
  grid-column-gap: calc(var(--prop-gap) * 2);
`;

export const MyCollectionsFilter = styled(MyCollectionsFilterComponent)`
  &.my-collections-filter {
    ${PaddedBlock};
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-grey-300);

    .unique-input-text,
    .unique-select {
      width: 100%;
    }

    .unique-select {
      .select-value {
        grid-column-gap: 7px;
      }
    }
  }
`;
