import { useCallback, useContext, useEffect, useMemo, VFC } from 'react';

import ApiContext from '@app/api/ApiContext';
import AccountContext from '@app/account/AccountContext';
import {
  useGraphQlCollectionsByTokensOwner,
  useGraphQlOwnerTokens,
} from '@app/api/graphQL/tokens';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { DeviceSize, useDeviceSize, useItemsLimit } from '@app/hooks';
import { useCheckExistTokensByAccount } from '@app/pages/hooks/useCheckExistTokensByAccount';
import { PagePaper } from '@app/components';
import { MobileFilters } from '@app/components/Filters/MobileFilter';
import {
  CollectionsFilter,
  NFTsTemplateList,
  StatusFilter,
  TypeFilter,
} from '@app/pages';
import { useGraphQlGetRftFractionsByOwner } from '@app/api/graphQL/tokens/useGraphQlGetRftFractionsByOwner';
import { TokenTypeEnum } from '@app/api/graphQL/types';

import { defaultStatusFilter, defaultTypeFilter } from '../constants';
import { useNFTsContext } from '../context';

export interface NFTsComponentProps {
  className?: string;
}

export const NFTs: VFC<NFTsComponentProps> = ({ className }) => {
  const deviceSize = useDeviceSize();
  const getLimit = useItemsLimit({ sm: 8, md: 9, lg: 6, xl: 8 });
  // this is temporal solution we need to discuss next steps
  const { selectedAccount } = useContext(AccountContext);
  const { currentChain } = useContext(ApiContext);
  const {
    tokensPage,
    statusFilter,
    sortByTokenId,
    collectionsIds,
    searchText,
    changeSearchText,
    changeStatusFilter,
    changeCollectionsIds,
    setCollectionsIds,
    changeTokensPage,
    typeFilter,
    changeTypeFilter,
  } = useNFTsContext();

  const { collections, collectionsLoading } = useGraphQlCollectionsByTokensOwner(
    selectedAccount?.address,
    !selectedAccount?.address,
  );

  const {
    tokens,
    tokensCount,
    tokensLoading,
    isPagination,
    fetchMore,
    refetchOwnerTokens,
  } = useGraphQlOwnerTokens(
    selectedAccount?.address,
    {
      statusFilter,
      collectionsIds,
      searchText,
      typeFilter,
    },
    {
      skip: !selectedAccount?.address,
      direction: sortByTokenId,
      pagination: { page: tokensPage, limit: getLimit },
    },
  );

  const {
    fractions,
    loading: fractionsLoading,
    refetch: fractionsRefetch,
  } = useGraphQlGetRftFractionsByOwner(selectedAccount?.address, tokens || []);

  const { cacheTokens } = useCheckExistTokensByAccount({
    tokens,
    refetchTokens: refetchOwnerTokens,
  });

  const defaultCollections = useMemo(
    () =>
      collections?.map((c) => ({
        value: c.collection_id,
        label: c.collection_name,
        icon: c.collection_cover,
      })),
    [collections],
  );

  const chips = useMemo(() => {
    const chips = [];
    searchText &&
      chips.push({
        label: searchText,
        onClose: () => changeSearchText(''),
      });

    if (statusFilter !== 'allStatus') {
      chips.push({
        label:
          defaultStatusFilter.find(({ value }) => value === statusFilter)?.label || '',
        onClose: () => changeStatusFilter('allStatus'),
      });
    }

    if (typeFilter !== 'allType') {
      chips.push({
        label: defaultTypeFilter.find(({ value }) => value === typeFilter)?.label || '',
        onClose: () => changeTypeFilter('allType'),
      });
    }

    collectionsIds?.forEach((id) => {
      const { label, icon = null } =
        defaultCollections?.find((c) => c.value === id && c) || {};
      chips.push({
        label,
        iconLeft: { size: 22, file: getTokenIpfsUriByImagePath(icon) },
        onClose: () => changeCollectionsIds(id),
      });
    });
    return chips;
  }, [searchText, statusFilter, typeFilter, collectionsIds, defaultCollections]);

  const resetFilters = useCallback(() => {
    changeSearchText('');
    changeStatusFilter('allStatus');
    changeTypeFilter('allType');
    setCollectionsIds([]);
  }, [changeSearchText, changeStatusFilter, changeTypeFilter, setCollectionsIds]);

  useEffect(() => {
    resetFilters();
  }, [currentChain.network, resetFilters, selectedAccount]);

  const tokensWithFractions = useMemo(() => {
    return (
      tokens?.map((token) => {
        if (token.type === TokenTypeEnum.RFT) {
          const ownedFractions =
            fractions?.find(
              ({ collection_id, token_id }) =>
                collection_id === token.collection_id && token_id === token.token_id,
            )?.amount || '0';

          return { ...token, ownedFractions };
        }
        return token;
      }) || []
    );
  }, [tokens, fractions]);

  return (
    <>
      <PagePaper.Layout
        className={className}
        sidebar={
          !collectionsLoading && (
            <>
              <StatusFilter status={defaultStatusFilter} />
              <TypeFilter type={defaultTypeFilter} />
              <CollectionsFilter collections={defaultCollections} />
            </>
          )
        }
      >
        <NFTsTemplateList
          cacheTokens={cacheTokens}
          tokens={tokensWithFractions}
          isLoading={tokensLoading || fractionsLoading}
          chips={chips}
          fetchMore={fetchMore}
          paginationSettings={{
            current: tokensPage,
            pageSizes: [getLimit],
            show: isPagination,
            size: tokensCount,
          }}
          onChipsReset={resetFilters}
          onPageChange={changeTokensPage}
        />
      </PagePaper.Layout>

      {deviceSize <= DeviceSize.md && (
        <MobileFilters collections={defaultCollections} resetFilters={resetFilters} />
      )}
    </>
  );
};
