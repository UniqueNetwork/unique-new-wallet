import { KeyboardEvent, useState, VFC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';

import { iconDown, iconUp } from '@app/utils';
import { ROUTE } from '@app/routes';
import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import { Direction } from '@app/api/graphQL/types';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import {
  ListNftsFilterType,
  useNftFilterContext,
} from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import {
  ConfirmBtn,
  Button,
  IconProps,
  RadioGroup,
  RadioOptionValueType,
  Select,
} from '@app/components';
import { Search } from '@app/pages/components/Search';
import { TabsFilter } from '@app/pages/components/TabsFilter';
import { BottomBar, BottomBarHeader } from '@app/pages/components/BottomBar';
import { FormBody, FormRow, SettingsRow } from '@app/pages/components/FormComponents';
import { ControlGroup } from '@app/pages/components/ControlGroup';
import { ReachedTokensLimitModal } from '@app/pages/CreateNFT/ReachedTokensLimitModal';

import { useCollectionContext } from '../../useCollectionContext';

interface CollectionNftFiltersComponentProps {
  className?: string;
}

type SelectOption = { id: Direction; title: string; iconRight: IconProps };

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
    title: 'Token ID',
    iconRight: iconUp,
  },
  {
    id: 'desc',
    title: 'Token ID',
    iconRight: iconDown,
  },
];

const FormBodyStyled = styled(FormBody)`
  max-width: 520px;

  .unique-select {
    width: 100%;
  }

  .unique-accordion {
    &.expanded {
      .unique-accordion-content {
        padding: var(--prop-gap) 0;
      }
    }
  }
`;

export const CollectionNftFilters: VFC<CollectionNftFiltersComponentProps> = ({
  className,
}) => {
  const navigate = useNavigate();
  const { collectionId } = useParams<{ collectionId: string }>();
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
  const deviceSize = useDeviceSize();
  const { direction, type, search, onChangeSearch, onChangeDirection, onChangeType } =
    useNftFilterContext();
  const { collection } = useCollectionContext() || {};
  const [isReachedTokensLimitModalVisible, setIsReachedTokensLimitModalVisible] =
    useState(false);

  const { currentChain } = useApi();
  const [searchText, setSearchText] = useState(search);

  const [directionValue, setDirectionValue] = useState<Direction>(direction || 'desc');
  const [typeValue, setTypeValue] = useState<ListNftsFilterType>(type || 'all');

  const handleChangeDirection = (option: SelectOption) => {
    onChangeDirection(option.id);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      onChangeSearch(searchText);
    }
  };

  const handleSearch = () => {
    onChangeSearch(searchText);
  };

  const handleSearchClear = () => {
    onChangeSearch('');
    setSearchText('');
  };

  const handleApplyFilter = () => {
    onChangeDirection(directionValue);
    onChangeSearch(searchText);
    onChangeType(typeValue);
    setFilterOpen(!isFilterOpen);
  };

  const barButtons = [
    <Button
      key="Filter-toggle-button"
      role="primary"
      title="Filter and sort"
      onClick={handleApplyFilter}
    />,
  ];

  return (
    <>
      <TabsFilter
        buttons={
          <ConfirmBtn
            iconLeft={{
              name: 'plus',
              size: 12,
              color: 'currentColor',
            }}
            title="Create a token"
            role="primary"
            onClick={() => {
              if (collection && collection.token_limit <= collection.tokens_count) {
                setIsReachedTokensLimitModalVisible(true);
                return;
              }
              logUserEvent(UserEvents.CREATE_NFT);
              navigate(
                `/${currentChain?.network}/${ROUTE.CREATE_NFT}?collectionId=${collectionId}`,
              );
            }}
          />
        }
        className={classNames('collection-nft-filters', className)}
        controls={
          <ControlGroup>
            <RadioGroup
              align="horizontal"
              options={radioOptions}
              value={type}
              onChange={({ value }) => onChangeType(value as ListNftsFilterType)}
            />
            <Search
              value={searchText}
              onKeyDown={handleSearchKeyDown}
              onChange={setSearchText}
              onClear={handleSearchClear}
              onClick={handleSearch}
            />
            <Select
              options={sortOptions}
              value={direction}
              onChange={handleChangeDirection}
            />
          </ControlGroup>
        }
      />

      {deviceSize <= DeviceSize.md && (
        <BottomBar
          header={
            <BottomBarHeader title="Filters and sort" onBackClick={handleApplyFilter} />
          }
          buttons={barButtons}
          isOpen={isFilterOpen}
          parent={document.body}
        >
          <FormBodyStyled>
            <SettingsRow>
              <Search
                hideButton
                value={searchText}
                onKeyDown={handleSearchKeyDown}
                onChange={setSearchText}
                onClear={handleSearchClear}
              />
            </SettingsRow>
            <FormRow>
              <Select
                options={sortOptions}
                value={directionValue}
                onChange={(option: SelectOption) => setDirectionValue(option.id)}
              />
            </FormRow>
            <FormRow>
              <RadioGroup
                align="vertical"
                options={radioOptions}
                value={typeValue}
                onChange={({ value }) => setTypeValue(value as ListNftsFilterType)}
              />
            </FormRow>
            <ButtonsGroup>
              <Button title="Apply" onClick={handleApplyFilter} />
            </ButtonsGroup>
          </FormBodyStyled>
        </BottomBar>
      )}

      <ReachedTokensLimitModal
        isVisible={isReachedTokensLimitModalVisible}
        onClose={() => {
          setIsReachedTokensLimitModalVisible(false);
        }}
      />
    </>
  );
};

const ButtonsGroup = styled.div`
  position: absolute;
  bottom: 0;
  padding: calc(var(--prop-gap) / 1.6) calc(var(--prop-gap) / 2);
`;
