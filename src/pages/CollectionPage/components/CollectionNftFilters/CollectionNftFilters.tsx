import { VFC, useState, KeyboardEvent } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {
  IconProps,
  InputText,
  RadioGroup,
  Select,
  RadioOptionValueType,
} from '@unique-nft/ui-kit';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

import { iconDown, iconUp } from '@app/utils';
import {
  ListNftsFilterType,
  useNftFilterContext,
} from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { Direction } from '@app/api/graphQL/tokens';
import { ROUTE } from '@app/routes';
import { MintingBtn } from '@app/components';
import { collectionsQuery } from '@app/api/graphQL/collections/collections';
import { ViewCollection } from '@app/api';

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

  const { collectionId } = useParams<{ collectionId: string }>();
  const cache = useQuery(collectionsQuery).client.cache;
  const currentCollection: Pick<
    ViewCollection,
    'name' | 'description' | 'collection_id' | 'collection_cover'
  > | null = cache.readFragment({
    id: `view_collections:{"collection_id":${collectionId}}`,
    fragment: gql`
      fragment currentCollection on view_collections {
        name
        description
        collection_id
        collection_cover
      }
    `,
  });
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
      <MintingBtn
        iconLeft={{
          name: 'plus',
          size: 12,
          color: 'currentColor',
        }}
        title="Create an NFT"
        role="primary"
        onClick={() =>
          navigate(ROUTE.CREATE_NFT, {
            state: currentCollection
              ? {
                  id: currentCollection.collection_id,
                  title: currentCollection.name,
                  description: currentCollection.description,
                  img: currentCollection.collection_cover,
                }
              : null,
          })
        }
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
