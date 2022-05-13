import React, { VFC, useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Button, InputText, RadioGroup, Select } from '@unique-nft/ui-kit';

import { iconDown, iconUp, Option, RadioOption } from '@app/utils';

interface CollectionNftFiltersComponentProps {
  className?: string;
}

const radioOptions: RadioOption[] = [
  {
    value: 'All',
  },
  {
    value: 'Disowned',
  },
  {
    value: 'Sold',
  },
];

const sortOptions: Option[] = [
  {
    id: 'nftId-asc',
    title: 'NFT ID',
    iconRight: iconDown,
  },
  {
    id: 'nftId-desc',
    title: 'NFT ID',
    iconRight: iconUp,
  },
];

const CollectionNftFiltersComponent: VFC<CollectionNftFiltersComponentProps> = ({
  className,
}) => {
  const [sort, setSort] = useState<string>('nftId-asc');
  const [ownFilter, setOwnFilter] = useState<string>(radioOptions[0].value);

  const onChange = (option: Option) => {
    console.log('option', option);
    setSort(option.id);
  };

  const onOwnFilterChange = (option: RadioOption) => {
    setOwnFilter(option.value);
  };

  // todo - fix onChange for radio
  return (
    <div className={classNames('collection-nft-filters', className)}>
      <RadioGroup
        align="horizontal"
        options={radioOptions}
        // onChange={onOwnFilterChange}
      />
      <InputText
        iconLeft={{ name: 'magnify', size: 18, color: 'var(--color-blue-grey-500)' }}
        placeholder="Search"
      />
      <Select options={sortOptions} value={sort} onChange={onChange} />
      <Button
        iconLeft={{
          name: 'plus',
          size: 12,
          color: 'var(--color-additional-light)',
        }}
        title="Create an NFT"
        role="primary"
      />
    </div>
  );
};

export const CollectionNftFilters = styled(CollectionNftFiltersComponent)`
  &.collection-nft-filters {
    display: grid;
    grid-template-columns: 235px 502px 268px 183px;
    grid-column-gap: calc(var(--prop-gap) * 2);
    align-items: center;

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

  .unique-radio-group-wrapper {
    .unique-radio-wrapper {
      margin-bottom: 0;
    }
  }
`;
