import React, { useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Button, InputText, Select } from '@unique-nft/ui-kit';

import { iconDown, iconUp, Option } from '@app/utils';
import { PaddedBlock } from '@app/styles/styledVariables';
import { Grey300 } from '@app/styles/colors';

interface MyCollectionsFilterComponentProps {
  className?: string;
}

const sortOptions: Option[] = [
  {
    id: 'collectionId-asc',
    title: 'Collection ID',
    iconRight: iconDown,
  },
  {
    id: 'collectionId-desc',
    title: 'Collection ID',
    iconRight: iconUp,
  },
  {
    id: 'items-asc',
    title: 'items',
    iconRight: iconDown,
  },
  {
    id: 'items-desc',
    title: 'items',
    iconRight: iconUp,
  },
];

export const MyCollectionsFilterComponent: VFC<MyCollectionsFilterComponentProps> = ({
  className,
}) => {
  const [searchString, setSearchString] = useState<string>('');
  const [sort, setSort] = useState<string>('collectionId-asc');

  const onChange = (option: Option) => {
    console.log('option', option);
    setSort(option.id);
  };

  return (
    <div className={classNames('my-collections-filter', className)}>
      <LeftColumn>
        <InputText
          iconLeft={{ name: 'magnify', size: 18, color: 'var(--color-blue-grey-500)' }}
          value={searchString}
          onChange={setSearchString}
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
      />
    </div>
  );
};

export const LeftColumn = styled.div`
  display: grid;
  grid-template-columns: 502px 268px;
  grid-column-gap: calc(var(--gap) * 2);
`;

export const MyCollectionsFilter = styled(MyCollectionsFilterComponent)`
  &.my-collections-filter {
    ${PaddedBlock};
    display: flex;
    align-items: center;
    justify-content: space-between;
    // todo - change to var
    border-bottom: 1px solid ${Grey300};

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
