import classNames from 'classnames';
import { useContext, useMemo, VFC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import AccountContext from '@app/account/AccountContext';
import {
  useGraphQlCollectionsByTokensOwner,
  useGraphQlOwnerTokens,
} from '@app/api/graphQL/tokens';
import { MintingBtn } from '@app/components';
import { MobileFilters } from '@app/components/Filters/MobileFilter';
import { useApi } from '@app/hooks';
import { CollectionsFilter, TypeFilter } from '@app/pages';
import { NFTsTemplateList } from '@app/pages/components/Nfts/NFTsTemplateList';
import {
  InnerContent,
  InnerSidebar,
  InnerWrapper,
} from '@app/pages/components/PageComponents';
import { ROUTE } from '@app/routes';
import { Dictionary, getTokenIpfsUriByImagePath } from '@app/utils';

import { defaultLimit, defaultTypesFilters } from '../constants';
import { useNFTsContext } from '../context';

export interface NFTsComponentProps {
  className?: string;
}

export const NFTs: VFC<NFTsComponentProps> = ({ className }) => {
  const navigate = useNavigate();
  const { currentChain } = useApi();
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

  const resetFilters = () => {
    changeSearchText('');
    setTypesFilters([]);
    setCollectionsIds([]);
  };

  return (
    <InnerWrapperStyled className={classNames('my-tokens-nft', className)}>
      <InnerSidebar>
        <TypeFilter defaultTypes={defaultTypesFilters} />
        <CollectionsFilter collections={defaultCollections} />
      </InnerSidebar>
      <MintingBtn
        iconLeft={{
          name: 'plus',
          size: 12,
          color: 'currentColor',
        }}
        role="primary"
        title="Create an NFT"
        disabled={!Number(selectedAccount?.collectionsTotal)}
        className="minitng-btn-mobile"
        tooltip={
          !Number(selectedAccount?.collectionsTotal)
            ? 'Please create a collection first'
            : null
        }
        onClick={() => navigate(`/${currentChain?.network}/${ROUTE.CREATE_NFT}`)}
      />
      <InnerContent>
        <NFTsTemplateList
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
      </InnerContent>
      <MobileFilters collections={defaultCollections} resetFilters={resetFilters} />
    </InnerWrapperStyled>
  );
};

export const InnerWrapperStyled = styled(InnerWrapper)`
  .minitng-btn-mobile {
    display: none;
    @media (max-width: 1279px) {
      display: flex;
      width: 185px;
      margin: 25px 25px 0 25px;
    }
    @media (max-width: 1024px) {
      margin: 25px 0 0;
    }
    @media (max-width: 567px) {
      width: unset;
    }
  }
  @media (max-width: 1279px) {
    flex-direction: column;
  }
`;
