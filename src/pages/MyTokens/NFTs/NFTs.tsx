import { useContext, useMemo, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import {
  useGraphQlOwnerTokens,
  useGraphQlCollectionsByTokensOwner,
} from '@app/api/graphQL/tokens';
import AccountContext from '@app/account/AccountContext';
import { NFTsTemplateList } from '@app/pages/components/Nfts/NFTsTemplateList';
import { CollectionsFilter, TypeFilter } from '@app/pages';
import { Dictionary, getTokenIpfsUriByImagePath } from '@app/utils';

import { useNFTsContext } from '../context';
import { defaultLimit, defaultTypesFilters } from '../constants';

export interface NFTsComponentProps {
  className?: string;
}

const NFTsComponent: VFC<NFTsComponentProps> = ({ className }) => {
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
    <div className={classNames('my-tokens--nft', className)}>
      <div className="filters-column">
        <TypeFilter defaultTypes={defaultTypesFilters} />
        <CollectionsFilter
          isLoading={collectionsLoading}
          defaultCollections={defaultCollections}
        />
      </div>
      <div className="tokens-column">
        <NFTsTemplateList
          tokens={tokens}
          isLoading={tokensLoading}
          tokensCount={tokensCount}
          page={tokensPage}
          chips={chips}
          onChipsReset={handleChipsReset}
          onPageChange={changeTokensPage}
        />
      </div>
    </div>
  );
};

export const NFTs = styled(NFTsComponent)`
  display: flex;
  flex: 1;

  .filters-column {
    width: 235px;
    max-width: 235px;
    padding-top: calc(var(--prop-gap) * 2);
    padding-left: calc(var(--prop-gap) * 2);
    padding-right: calc(var(--prop-gap) * 1.5);
    border-right: 1px solid var(--color-grey-300);
  }

  .tokens-column {
    flex: 1;

    > div:nth-of-type(2) {
      margin-top: 16px;
      margin-bottom: 32px;
    }

    @media (max-width: 1024px) {
      padding-left: 0;
    }
  }
`;
