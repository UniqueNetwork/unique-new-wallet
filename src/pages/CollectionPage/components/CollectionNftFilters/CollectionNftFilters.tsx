import { KeyboardEvent, useState, VFC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import classNames from 'classnames';
import {
  Accordion,
  Button,
  IconProps,
  InputText,
  RadioGroup,
  RadioOptionValueType,
  Select,
} from '@unique-nft/ui-kit';

import { iconDown, iconUp } from '@app/utils';
import { ROUTE } from '@app/routes';
import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import { Direction } from '@app/api/graphQL/types';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import {
  ListNftsFilterType,
  useNftFilterContext,
} from '@app/pages/CollectionPage/components/CollectionNftFilters/context';
import { MintingBtn } from '@app/components';
import { TabsFilter } from '@app/pages/components/TabsFilter';
import { BottomBar, BottomBarHeader } from '@app/pages/components/BottomBar';
import { FormBody, FormRow, SettingsRow } from '@app/pages/components/FormComponents';

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
    iconRight: iconUp,
  },
  {
    id: 'desc',
    title: 'NFT ID',
    iconRight: iconDown,
  },
];

const FormBodyStyled = styled(FormBody)`
  max-width: 520px;

  .unique-input-text,
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

  const { currentChain } = useApi();
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

  const handleApplyFilter = () => setFilterOpen(!isFilterOpen);
  const barButtons = [];

  if (!isFilterOpen) {
    barButtons.push([
      <Button
        key="Filter-toggle-button"
        role="primary"
        title="Filter and sort"
        onClick={handleApplyFilter}
      />,
    ]);
  } else {
    barButtons.push([
      <Button key="Filter-apply-button" title="Apply" onClick={handleApplyFilter} />,
    ]);
  }

  return (
    <>
      <TabsFilter
        buttons={
          <MintingBtn
            iconLeft={{
              name: 'plus',
              size: 12,
              color: 'currentColor',
            }}
            title="Create an NFT"
            role="primary"
            onClick={() => {
              logUserEvent(UserEvents.CREATE_NFT);
              navigate(
                `/${currentChain?.network}/${ROUTE.CREATE_NFT}?collectionId=${collectionId}`,
              );
            }}
          />
        }
        className={classNames('collection-nft-filters', className)}
        controls={
          <>
            <RadioGroup
              align="horizontal"
              options={radioOptions}
              onChange={({ value }) => onChangeType(value as ListNftsFilterType)}
            />
            <InputText
              iconLeft={{
                name: 'magnify',
                size: 18,
                color: 'var(--color-blue-grey-500)',
              }}
              placeholder="Search"
              value={search}
              onKeyDown={handleSearch}
              onChange={setSearch}
            />
            <Select
              options={sortOptions}
              value={direction}
              onChange={handleChangeDirection}
            />
          </>
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
              <InputText
                iconLeft={{
                  name: 'magnify',
                  size: 18,
                  color: 'var(--color-blue-grey-500)',
                }}
                placeholder="Search"
                value={search}
                onKeyDown={handleSearch}
                onChange={setSearch}
              />
            </SettingsRow>
            <FormRow>
              <Select
                options={sortOptions}
                value={direction}
                onChange={handleChangeDirection}
              />
            </FormRow>
            <FormRow>
              <Accordion expanded title="Status">
                <RadioGroup
                  align="vertical"
                  options={radioOptions}
                  onChange={({ value }) => onChangeType(value as ListNftsFilterType)}
                />
              </Accordion>
            </FormRow>
          </FormBodyStyled>
        </BottomBar>
      )}
    </>
  );
};
