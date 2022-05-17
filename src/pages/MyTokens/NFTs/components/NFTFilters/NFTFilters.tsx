import React, { VFC, useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Button, InputText, Select } from '@unique-nft/ui-kit';

import { iconDown, iconUp, Option } from '@app/utils';

interface NFTFiltersComponentProps {
  className?: string;
}

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

const NFTFiltersComponent: VFC<NFTFiltersComponentProps> = ({ className }) => {
  const [sort, setSort] = useState<string>('nftId-asc');

  const onChange = (option: Option) => {
    console.log('option', option);
    setSort(option.id);
  };

  return (
    <div className={classNames('nft-filters', className)}>
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

export const NFTFilters = styled(NFTFiltersComponent)`
  &.nft-filters {
    display: grid;
    grid-template-columns: 502px 268px 183px;
    grid-column-gap: calc(var(--prop-gap) * 2);

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
`;
