import React, { useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { IconProps, InputText, Select } from '@unique-nft/ui-kit';
import { useNavigate } from 'react-router-dom';

import { TOrderBy } from '@app/api';
import { useApi } from '@app/hooks';
import { MintingBtn } from '@app/components';
import { Direction } from '@app/api/graphQL/types';
import { iconDown, iconUp, Option } from '@app/utils';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import { useMyCollectionsContext } from '@app/pages/MyCollections/context';
import { ButtonGroup } from '@app/pages/components/FormComponents';

type SelectOption = {
  id: string;
  title: string;
  iconRight: IconProps;
};

interface TopFilterComponentProps {
  className?: string;
  showFilter?: boolean;
  view?: 'column' | 'row';
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

export const TopFilterComponent: VFC<TopFilterComponentProps> = ({
  className,
  showFilter,
  view = 'row',
}: TopFilterComponentProps) => {
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
    logUserEvent(UserEvents.CREATE_COLLECTION);
    navigate(`/${currentChain?.network}/create-collection/main-information`);
  };

  return (
    <div className={classNames('my-collections-filter', className)}>
      {showFilter && (
        <ControlGroup className={'__as_' + view}>
          <InputText
            iconLeft={{ name: 'magnify', size: 18, color: 'var(--color-blue-grey-500)' }}
            value={searchString}
            placeholder="Search"
            onChange={setSearchString}
            onKeyDown={handleSearchString}
          />
          <Select options={sortOptions} value={sort} onChange={onChange} />
        </ControlGroup>
      )}
      {view === 'row' && (
        <ButtonGroup as={ControlsContainer}>
          <MintingBtn
            iconLeft={{
              name: 'plus',
              size: 12,
              color: 'currentColor',
            }}
            title="Create collection"
            role="primary"
            onClick={onCreateCollection}
          />
        </ButtonGroup>
      )}
    </div>
  );
};

export const ControlGroup = styled.div`
  flex: 1 1 100%;
  display: grid;
  gap: var(--prop-gap);

  &.__as {
    &_row {
      @media screen and (min-width: 768px) {
        grid-template-columns: 2fr 1fr;
      }

      @media screen and (min-width: 1024px) {
        max-width: 786px;
      }
    }

    &_column {
      width: 100%;
      max-width: 765px;
      margin-right: auto;
    }
  }
`;

const ControlsContainer = styled.div`
  @media screen and (min-width: 1024px) {
    margin-left: auto;
  }
`;

export const TopFilter = styled(TopFilterComponent)`
  box-sizing: border-box;
  flex: 1 1 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: ${(p) => p.view};
  align-items: center;
  width: 100%;
  gap: var(--prop-gap) calc(var(--prop-gap) * 2);

  .unique-input-text,
  .unique-select {
    width: 100%;
  }
  .unique-input-text .input-wrapper:hover {
    border: 1px solid var(--color-grey-500);
  }
`;
