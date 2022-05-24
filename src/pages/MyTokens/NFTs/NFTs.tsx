import { useContext, useEffect, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import { useAccounts } from '@app/hooks';
import {
  useGraphQlOwnerTokens,
  useGraphQlCollectionsByTokensOwner,
} from '@app/api/graphQL/tokens';

import { CollectionsFilter, NFTsList, TypeFilter } from './components';

export interface NFTsComponentProps {
  className?: string;
}

const NFTsComponent: VFC<NFTsComponentProps> = ({ className }) => {
  // this is temporal solution we need to discuss next steps
  const { selectedAccount, fetchAccounts } = useAccounts();
  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  const { collections, collectionsLoading } = useGraphQlCollectionsByTokensOwner(
    selectedAccount?.address,
    !selectedAccount?.address,
  );
  const { tokens, tokensCount, tokensLoading, fetchPageData } = useGraphQlOwnerTokens(
    selectedAccount?.address,
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
