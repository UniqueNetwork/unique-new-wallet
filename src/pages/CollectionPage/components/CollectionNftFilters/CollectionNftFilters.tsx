import { VFC, useState, KeyboardEvent } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {
  Button,
  IconProps,
  InputText,
  RadioGroup,
  Select,
  RadioOptionValueType,
} from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { iconDown, iconUp } from '@app/utils';
import {
  ListNftsFilterType,
  useNftFilterContext,
} from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { Direction } from '@app/api/graphQL/tokens';
import { ROUTE } from '@app/routes';

interface CollectionNftFiltersComponentProps {
  className?: string;
}

type SelectOption = { id: Direction; title: string; iconRight: IconProps };

const KEY_CODE_ENTER = 13;

const radioOptions: RadioOptionValueType[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'owned',
    label: 'Owned',
  },
  {
    value: 'disowned',
    label: 'Disowned',
  },
];

const sortOptions: SelectOption[] = [
  {
    id: 'asc',
    title: 'NFT ID',
    iconRight: iconDown,
  },
  {
    id: 'desc',
    title: 'NFT ID',
    iconRight: iconUp,
  },
];

const CollectionNftFiltersComponent: VFC<CollectionNftFiltersComponentProps> = ({
  className,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { direction, onChangeSearch, onChangeDirection, onChangeType } =
    useNftFilterContext();

  const handleChangeDirection = (option: SelectOption) => {
    onChangeDirection(option.id);
  };

  const handleSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === KEY_CODE_ENTER) {
      onChangeSearch(search);
    }
  };

  return (
    <div className={classNames('collection-nft-filters', className)}>
      <RadioGroup
        align="horizontal"
        options={radioOptions}
        onChange={({ value }) => onChangeType(value as ListNftsFilterType)}
      />
      <InputText
        iconLeft={{ name: 'magnify', size: 18, color: 'var(--color-blue-grey-500)' }}
        placeholder="Search"
        value={search}
        onKeyDown={handleSearch}
        onChange={setSearch}
      />
      <Select options={sortOptions} value={direction} onChange={handleChangeDirection} />
      <Button
        iconLeft={{
          name: 'plus',
          size: 12,
          color: 'var(--color-additional-light)',
        }}
        title="Create an NFT"
        role="primary"
        onClick={() => navigate(ROUTE.CREATE_NFT)}
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
