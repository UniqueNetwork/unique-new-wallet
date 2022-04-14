import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { Button, InputText, Select, Text } from '@unique-nft/ui-kit';

import { TokensList } from '../../components';
import { Secondary400 } from '../../styles/colors';
import { useApi } from '../../hooks/useApi';
import { NFTToken } from '../../api/chainApi/unique/types';
import { Filters, MyTokensFilterState } from './Filters/Filters';
import { useAccounts } from '../../hooks/useAccounts';
import { useOffers } from '../../api/restApi/offers/offers';
import { Offer } from '../../api/restApi/offers/types';
import { MobileFilters } from '../../components/Filters/MobileFilter';
import Loading from '../../components/Loading';
import { PagePaper } from '../../components/PagePaper/PagePaper';
import NoItems from '../../components/NoItems';

type TOption = {
  direction: 'asc' | 'desc';
  field: keyof Pick<Offer & NFTToken, 'price' | 'id' | 'creationDate'>;
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
    direction: 'asc',
    field: 'price',
    iconRight: { color: Secondary400, name: 'arrow-up', size: 16 },
    id: 'asc(Price)',
    title: 'Price'
  },
  {
    direction: 'desc',
    field: 'price',
    iconRight: { color: Secondary400, name: 'arrow-down', size: 16 },
    id: 'desc(Price)',
    title: 'Price'
  },
  {
    direction: 'asc',
    field: 'id',
    iconRight: { color: Secondary400, name: 'arrow-up', size: 16 },
    id: 'asc(TokenId)',
    title: 'Token ID'
  },
  {
    direction: 'desc',
    field: 'id',
    iconRight: { color: Secondary400, name: 'arrow-down', size: 16 },
    id: 'desc(TokenId)',
    title: 'Token ID'
  },
  {
    direction: 'asc',
    field: 'creationDate',
    iconRight: { color: Secondary400, name: 'arrow-up', size: 16 },
    id: 'asc(CreationDate)',
    title: 'Listing date'
  },
  {
    direction: 'desc',
    field: 'creationDate',
    iconRight: { color: Secondary400, name: 'arrow-down', size: 16 },
    id: 'desc(CreationDate)',
    title: 'Listing date'
  }
];

const pageSize = 1000;

const defaultSortingValue = {
  id: 'desc(CreationDate)'
};

export const NFTPage = () => {
  const [filterState, setFilterState] = useState<MyTokensFilterState | null>(
    null
  );
  const [sortingValue, setSortingValue] =
    useState<{ id: string }>(defaultSortingValue);
  const [searchValue, setSearchValue] = useState<string>();
  const [searchString, setSearchString] = useState<string>();
  const [selectOption, setSelectOption] = useState<TOption>();
  const { selectedAccount } = useAccounts();
  const [tokens, setTokens] = useState<NFTToken[]>([]);
  const [isFetchingTokens, setIsFetchingTokens] = useState<boolean>(true);

  const {
    offers,
    isFetching: isFetchingOffers,
    fetch
  } = useOffers({ page: 1, pageSize, seller: selectedAccount?.address });

  const { api } = useApi();

  const fetchOffersBySeller = useCallback(() => {
    if (!selectedAccount?.address) return;
    fetch({ page: 1, pageSize, seller: selectedAccount?.address });
  }, [selectedAccount?.address]);

  useEffect(() => {
    void fetchOffersBySeller();
  }, [fetchOffersBySeller]);

  useEffect(() => {
    if (!api?.nft || !selectedAccount?.address) return;
    setIsFetchingTokens(true);
    console.log('FetchingTokens');
    void (async () => {
      const _tokens = (await api.nft?.getAccountTokens(
        selectedAccount.address
      )) as NFTToken[];
      setTokens((tokens) => [...tokens, ..._tokens]);
      setIsFetchingTokens(false);
    })();
  }, [selectedAccount?.address, api?.nft, setIsFetchingTokens]);

  useEffect(() => {
    if (!api?.nft) return;
    setIsFetchingTokens(true);
    void (async () => {
      const _tokensFromOffers = (await Promise.all(
        offers.map(({ tokenId, collectionId }) =>
          api.nft?.getToken(collectionId, tokenId)
        )
      )) as NFTToken[];
      setTokens((tokens) => [...tokens, ..._tokensFromOffers]);
      setIsFetchingTokens(false);
    })();
  }, [offers, api?.nft, setIsFetchingTokens]);

  useEffect(() => {
    const option = sortingOptions.find((option) => {
      return option.id === sortingValue.id;
    });

    setSelectOption(option);
  }, [sortingValue, setSelectOption]);

  const onSortingChange = useCallback((val) => {
    setSortingValue(val.id);
  }, []);

  const onChangeSearchValue = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const onSearch = useCallback(() => {
    setSearchString(searchValue);
  }, [searchValue]);

  const filter = useCallback(
    (token: NFTToken & Partial<Offer>) => {
      let filterByStatus = true;
      if (filterState?.onSell) {
        filterByStatus = !!token.seller;
      }
      if (filterState?.fixedPrice) {
        filterByStatus = !!token.seller && !token.auction;
      }
      if (filterState?.timedAuction) {
        filterByStatus = !!token.seller && !!token.auction;
      }
      if (filterState?.notOnSale) {
        filterByStatus = !token.seller;
      }
      let filteredByPrice = true;
      if (filterState?.minPrice && filterState?.maxPrice) {
        if (!token.price) {
          filteredByPrice = false;
        } else {
          const tokenPrice = Number(token.price);
          filteredByPrice =
            tokenPrice >= filterState.minPrice &&
            tokenPrice <= filterState.maxPrice;
        }
      }
      let filteredByCollections = true;
      if (filterState?.collectionIds && filterState?.collectionIds.length > 0) {
        filteredByCollections =
          filterState.collectionIds.findIndex(
            (collectionId: number) => token.collectionId === collectionId
          ) > -1;
      }
      let filteredBySearchValue = true;
      if (searchString) {
        filteredBySearchValue =
          token.collectionName?.includes(searchString) ||
          token.prefix?.includes(searchString) ||
          token.id === Number(searchString);
      }

      return (
        filterByStatus &&
        filteredByPrice &&
        filteredByCollections &&
        filteredBySearchValue
      );
    },
    [filterState, searchString]
  );

  const featuredTokens: (NFTToken & Partial<Offer>)[] = useMemo(() => {
    const tokensWithOffers = tokens
      .map((token) => ({
        ...(offers.find(
          (offer) =>
            offer.tokenId === token.id &&
            offer.collectionId === token.collectionId
        ) || {}),
        ...token
      }))
      .filter(filter);

    if (selectOption) {
      return tokensWithOffers.sort((tokenA, tokenB) => {
        const order = selectOption.direction === 'asc' ? 1 : -1;
        return (tokenA[selectOption.field] || '') >
          (tokenB[selectOption.field] || '')
          ? order
          : -order;
      });
    }
    return tokensWithOffers;
  }, [tokens, offers, filter, selectOption, filterState]);

  return (
    <PagePaper>
      <MinterMainPageStyled>
        <LeftColumn>
          <Filters onFilterChange={setFilterState} />
        </LeftColumn>
        <MainContent>
          <SearchAndSortingWrapper>
            <SearchWrapper>
              <InputText
                iconLeft={{ name: 'magnify', size: 16 }}
                onChange={onChangeSearchValue}
                placeholder='Collection / token'
                value={searchValue?.toString()}
              />
              <Button onClick={onSearch} role='primary' title='Search' />
            </SearchWrapper>
            <SortSelectWrapper>
              <Select
                onChange={onSortingChange}
                options={sortingOptions}
                value={sortingValue.id}
              />
            </SortSelectWrapper>
          </SearchAndSortingWrapper>
          <div>
            <Text size='m'>{`${featuredTokens.length} items`}</Text>
          </div>
          <TokensListWrapper>
            {(isFetchingTokens || isFetchingOffers) && <Loading />}
            {!isFetchingTokens &&
              !isFetchingOffers &&
              featuredTokens.length === 0 && <NoItems />}
            <TokensList tokens={featuredTokens} />
          </TokensListWrapper>
        </MainContent>
        <MobileFilters<MyTokensFilterState>
          defaultSortingValue={defaultSortingValue}
          sortingValue={sortingValue.id}
          sortingOptions={sortingOptions}
          onFilterChange={setFilterState}
          onSortingChange={onSortingChange}
          filterComponent={Filters}
        />
      </MinterMainPageStyled>
    </PagePaper>
  );
};

const MinterMainPageStyled = styled.div`
  display: flex;
  flex: 1;
`;

const LeftColumn = styled.div`
  padding-right: 24px;
  border-right: 1px solid var(--grey-300);
  @media (max-width: 1024px) {
    display: none;
  }
`;

const MainContent = styled.div`
  padding-left: 32px;
  flex: 1;

  > div:nth-of-type(2) {
    margin-top: 16px;
    margin-bottom: 32px;
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

const TokensListWrapper = styled.div`
  min-height: 640px;
`;
