import { useContext, useMemo, VFC } from 'react';
import classNames from 'classnames';

import {
  useGraphQlCollectionsByTokensOwner,
  useGraphQlOwnerTokens,
} from '@app/api/graphQL/tokens';
import AccountContext from '@app/account/AccountContext';
import { Dictionary, getTokenIpfsUriByImagePath } from '@app/utils';
import { CollectionsFilter, TypeFilter } from '@app/pages';
import {
  InnerContent,
  InnerSidebar,
  InnerWrapper,
} from '@app/pages/components/PageComponents';
import { NFTsTemplateList } from '@app/pages/components/Nfts/NFTsTemplateList';

import { useNFTsContext } from '../context';
import { defaultLimit, defaultTypesFilters } from '../constants';

export interface NFTsComponentProps {
  className?: string;
}

export const NFTs: VFC<NFTsComponentProps> = ({ className }) => {
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
  const { tokens, tokensCount, tokensLoading } = useGraphQlOwnerTokens(
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
  }, [searchText, typesFilters, collectionsIds]);

  const handleChipsReset = () => {
    changeSearchText('');
    setTypesFilters([]);
    setCollectionsIds([]);
  };

  return (
    <InnerWrapper className={classNames('my-tokens-nft', className)}>
      <InnerSidebar>
        <TypeFilter defaultTypes={defaultTypesFilters} />
        <CollectionsFilter
          isLoading={collectionsLoading}
          defaultCollections={defaultCollections}
        />
      </InnerSidebar>
      <InnerContent>
        <NFTsTemplateList
          tokens={tokens}
          isLoading={tokensLoading}
          tokensCount={tokensCount}
          page={tokensPage}
          chips={chips}
          onChipsReset={handleChipsReset}
          onPageChange={changeTokensPage}
        />
      </InnerContent>
    </InnerWrapper>
  );
};
