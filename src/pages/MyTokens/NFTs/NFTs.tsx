import { useContext, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import AccountContext from '@app/account/AccountContext';
import { CollectionsFilter, NFTsList, TypeFilter } from './components';
import { useGraphQlCollectionsByAccount } from '@app/api/graphQL/collections';

export interface NFTsComponentProps {
  className?: string;
}

const NFTsComponent: VFC<NFTsComponentProps> = ({ className }) => {
  const { selectedAccount } = useContext(AccountContext);
  const { collections, collectionsLoading, error } = useGraphQlCollectionsByAccount(selectedAccount?.address);

  return (
    <div className={classNames('my-tokens--nft', className)}>
      <div className="filters-column">
        <TypeFilter />
        <CollectionsFilter collections={collections} />
      </div>
      <div className="tokens-column">
        <NFTsList />
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
