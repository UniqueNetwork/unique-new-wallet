import { useContext, useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import AccountContext from '@app/account/AccountContext';
import { useGraphQlAccountTokens } from '@app/api/graphQL/tokens';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';

import { CollectionsFilter, NFTsList, TypeFilter } from './components';

export interface NFTsComponentProps {
  className?: string;
}

const NFTsComponent: VFC<NFTsComponentProps> = ({ className }) => {
  const { selectedAccount } = useContext(AccountContext);
  const { collections, collectionsLoading } = useGraphQlCollectionsByAccount(
     selectedAccount?.address ?? null,
    !selectedAccount?.address,
  );
  const { tokens, tokensCount, tokensLoading, fetchPageData } = useGraphQlAccountTokens(
    selectedAccount?.address ?? null,
    { collectionIds: collections?.map((c) => c.collection_id) },
    { skip: !selectedAccount?.address || collectionsLoading },
  );

  return (
    <div className={classNames('my-tokens--nft', className)}>
      <div className="filters-column">
        <TypeFilter />
        <CollectionsFilter collections={collections} />
      </div>
      <div className="tokens-column">
        <NFTsList
          tokens={tokens}
          tokensCount={tokensCount}
          pageChangeHandler={fetchPageData}
        />
      </div>
    </div>
  );
};

export const NFTs = styled(NFTsComponent)`
  display: flex;
  flex: 1;

  .filters-column {
    padding-top: calc(var(--prop-gap) * 2);
    padding-right: calc((var(--prop-gap) / 2) * 3);
    border-right: 1px solid var(--color-grey-300);

    @media (max-width: 1024px) {
      display: none;
    }
  }

  .tokens-column {
    padding-left: 32px;
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
