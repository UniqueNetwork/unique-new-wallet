import { useContext, useMemo, VFC } from 'react';

import AccountContext from '@app/account/AccountContext';
import {
  useGraphQlCollectionsByTokensOwner,
  useGraphQlOwnerTokens,
} from '@app/api/graphQL/tokens';
import { Dictionary, getTokenIpfsUriByImagePath } from '@app/utils';
import { DeviceSize, useDeviceSize } from '@app/hooks';
import { useCheckExistTokensByAccount } from '@app/pages/hooks/useCheckExistTokensByAccount';
import { PagePaper } from '@app/components';
import { MobileFilters } from '@app/components/Filters/MobileFilter';
import { CollectionsFilter, TypeFilter } from '@app/pages';
import { NFTsTemplateList } from '@app/pages/components/Nfts/NFTsTemplateList';

import { defaultLimit, defaultTypesFilters } from '../constants';
import { useNFTsContext } from '../context';

export interface NFTsComponentProps {
  className?: string;
}

export const NFTs: VFC<NFTsComponentProps> = ({ className }) => {
  const deviceSize = useDeviceSize();
  // this is temporal solution we need to discuss next steps
  const { selectedAccount } = useContext(AccountContext);
  const {
    tokensPage,
    typesFilters,
    sortByTokenId,
    collectionsIds,
    searchText,
    changeSearchText,
    setTypesFilters,
    changeTypesFilters,
    changeCollectionsIds,
    setCollectionsIds,
    changeTokensPage,
  } = useNFTsContext();

  const { collections, collectionsLoading } = useGraphQlCollectionsByTokensOwner(
    selectedAccount?.address,
    !selectedAccount?.address,
  );

  const { tokens, tokensCount, tokensLoading, isPagination, fetchMoreMethod } =
    useGraphQlOwnerTokens(
      selectedAccount?.address,
      {
        typesFilters,
        collectionsIds,
        searchText,
      },
      {
        skip: !selectedAccount?.address,
        direction: sortByTokenId,
        pagination: { page: tokensPage, limit: defaultLimit },
      },
    );

  const { cacheTokens } = useCheckExistTokensByAccount({ tokens });

  const defaultCollections = useMemo(
    () =>
      collections?.map((c) => ({
        id: c.collection_id,
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
    typesFilters?.forEach((filter) =>
      chips.push({
        label: Dictionary[`filter_type_${filter}`],
        onClose: () => changeTypesFilters(filter),
      }),
    );
    collectionsIds?.forEach((id) => {
      const { label, icon = null } =
        defaultCollections?.find((c) => c.id === id && c) || {};
      chips.push({
        label,
        iconLeft: { size: 22, file: getTokenIpfsUriByImagePath(icon) },
        onClose: () => changeCollectionsIds(id),
      });
    });
    return chips;
  }, [searchText, typesFilters, collectionsIds, defaultCollections]);

  const resetFilters = () => {
    changeSearchText('');
    setTypesFilters([]);
    setCollectionsIds([]);
  };

  return (
    <>
      <PagePaper.Layout
        className={className}
        sidebar={
          !collectionsLoading && (
            <>
              <TypeFilter defaultTypes={defaultTypesFilters} />
              <CollectionsFilter collections={defaultCollections} />
            </>
          )
        }
      >
        {/* TODO: cacheTokens */}
        <NFTsTemplateList
          cacheTokens={cacheTokens}
          tokens={tokens}
          isLoading={tokensLoading}
          chips={chips}
          fetchMore={fetchMoreMethod}
          paginationSettings={{
            current: tokensPage,
            pageSizes: [defaultLimit],
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
