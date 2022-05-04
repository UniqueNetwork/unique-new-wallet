import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Text, TokenLink, Pagination } from '@unique-nft/ui-kit';

export interface TokenCardView {
  collectionName: string;
  tokenId: string;
  tokenPrefix: string;
  url: string;
}

export interface NFTsListComponentProps {
  className?: string;
}

const tokens: TokenCardView[] = [];

const NFTsListComponent: VFC<NFTsListComponentProps> = ({ className }) => {
  const onPageChange = (page: number) => {
    console.log('page', page);
  };

  return (
    <div className={classNames('nft-list', className)}>
      {tokens.map((token) => (
        <TokenLink
          image="https://ipfs.unique.network/ipfs/QmaPhgoqUVNLi9v6Rfqvx3jp5WyGNMZibWxouWTQqGXG8e"
          key={token.tokenId}
          link={{
            href: '/',
            title: 'CHEL #8624',
          }}
          title="CHEL #8624"
        />
      ))}
      <div className="nft-list--footer">
        <Text size="m">{`${tokens.length} items`}</Text>
        <Pagination withIcons size={100} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export const NFTsList = styled(NFTsListComponent)`
  .nft-list {
    &--footer {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding-top: calc(var(--gap) * 2);
    }
  }
`;
