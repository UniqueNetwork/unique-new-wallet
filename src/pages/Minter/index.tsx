import styled from 'styled-components/macro';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Button, InputText, Select, Text } from '@unique-nft/ui-kit';

import { Filters } from '../../components';
import { FilterState } from '../../components/Filters/types';
import { useOffers } from '../../api/restApi/offers/offers';
import { OffersList } from '../../components/OffersList/OffersList';
import { MobileFilters } from '../../components/Filters/MobileFilter';
import { PagePaper } from '../../components/PagePaper/PagePaper';
import Loading from '../../components/Loading';
import NoItems from '../../components/NoItems';

type TOption = {
  iconRight: {
    color: string;
    name: string;
    size: number;
  };
  id: string;
  title: string;
};

const sortingOptions: TOption[] = [
  {
    iconRight: { color: 'var(--color-secondary-400)', name: 'arrow-up', size: 16 },
    id: 'asc(Price)',
    title: 'Price',
  },
  {
    iconRight: { color: 'var(--color-secondary-400)', name: 'arrow-down', size: 16 },
    id: 'desc(Price)',
    title: 'Price',
  },
  {
    iconRight: { color: 'var(--color-secondary-400)', name: 'arrow-up', size: 16 },
    id: 'asc(TokenId)',
    title: 'Token ID',
  },
  {
    iconRight: { color: 'var(--color-secondary-400)', name: 'arrow-down', size: 16 },
    id: 'desc(TokenId)',
    title: 'Token ID',
  },
  {
    iconRight: { color: 'var(--color-secondary-400)', name: 'arrow-up', size: 16 },
    id: 'asc(CreationDate)',
    title: 'Listing date',
  },
  {
    iconRight: { color: 'var(--color-secondary-400)', name: 'arrow-down', size: 16 },
    id: 'desc(CreationDate)',
    title: 'Listing date',
  },
];

const pageSize = 6;

const defaultSortingValue = {
  id: 'desc(CreationDate)',
};

export const MinterPage = () => {
  const [filterState, setFilterState] = useState<FilterState | null>();
  const [sortingValue, setSortingValue] = useState(defaultSortingValue);
  const [searchValue, setSearchValue] = useState<string>();
  const { offers, offersCount, isFetching, fetchMore, fetch } = useOffers({
    pageSize,
    sort: [sortingValue.id],
  });

  const hasMore = offers && offers.length < offersCount;

  useEffect(() => {
    fetch({ page: 1, pageSize });
  }, [fetch]);

  const onClickSeeMore = useCallback(() => {
    // Todo: fix twice rendering
    if (!isFetching) {
      fetchMore({
        page: Math.ceil(offers.length / pageSize) + 1,
        pageSize,
        sort: [sortingValue.id],
        ...filterState,
      });
    }
  }, [fetchMore, offers, pageSize, isFetching]);

  const onSortingChange = useCallback(
    (val) => {
      setSortingValue(val.id);
      fetch({ sort: [val.id], pageSize, page: 1, ...filterState });
    },
    [fetch],
  );

  const handleSearch = () => {
    fetch({
      sort: [sortingValue.id],
      pageSize,
      page: 1,
      searchText: searchValue?.toString(),
      ...filterState,
    });
  };

  const onFilterChange = useCallback(
    (filter: FilterState | null) => {
      setFilterState({ ...(filterState || {}), ...filter });
      fetch({
        pageSize,
        page: 1,
        sort: [sortingValue.id],
        ...(filterState || {}),
        ...filter,
      });
    },
    [filterState],
  );

  return (
    <PagePaper>
      <MinterMainPageStyled>
        <LeftColumn>
          <Filters onFilterChange={onFilterChange} />
        </LeftColumn>
        <MainContent>
          <SearchAndSortingWrapper>
            <SearchWrapper>
              <InputText
                iconLeft={{ name: 'magnify', size: 16 }}
                placeholder="Collection / token"
                value={searchValue?.toString()}
                onChange={(val: string) => setSearchValue(val)}
              />
              <Button role="primary" title="Search" onClick={() => handleSearch()} />
            </SearchWrapper>
            <SortSelectWrapper>
              <Select
                options={sortingOptions}
                value={sortingValue.id}
                onChange={onSortingChange}
              />
            </SortSelectWrapper>
          </SearchAndSortingWrapper>
          <div>
            <Text size="m">{`${offersCount} items`}</Text>
          </div>
          <InfiniteScroll
            hasMore={hasMore}
            initialLoad={false}
            loadMore={onClickSeeMore}
            pageStart={1}
            threshold={200}
            useWindow={true}
          >
            {isFetching && <Loading />}
            {!isFetching && !offers?.length && <NoItems />}
            <OffersList offers={offers || []} />
          </InfiniteScroll>
        </MainContent>
      </MinterMainPageStyled>
      <MobileFilters
        defaultSortingValue={defaultSortingValue}
        sortingValue={sortingValue.id}
        sortingOptions={sortingOptions}
        filterComponent={Filters}
        onFilterChange={onFilterChange}
        onSortingChange={onSortingChange}
      />
    </PagePaper>
  );
};

const MinterMainPageStyled = styled.div`
  display: flex;
  flex: 1;
`;

const LeftColumn = styled.div`
  padding-right: 24px;
  border-right: 1px solid var(--color-grey-300);
  @media (max-width: 1024px) {
    display: none;
  }
`;

const MainContent = styled.div`
  padding-left: calc(var(--prop-gap) * 2);
  flex: 1;

  > div:nth-of-type(2) {
    margin-top: var(--prop-gap);
    margin-bottom: calc(var(--prop-gap) * 2);
  }

  @media (max-width: 1024px) {
    padding-left: 0;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  button {
    margin-left: 8px;
  }

  @media (max-width: 768px) {
    width: 100%;
    .unique-input-text {
      flex-grow: 1;
    }
  }

  @media (max-width: 320px) {
    .unique-button {
      display: none;
    }
  }
`;

const SortSelectWrapper = styled.div`
  @media (max-width: 1024px) {
    display: none;
  }
`;

const SearchAndSortingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
