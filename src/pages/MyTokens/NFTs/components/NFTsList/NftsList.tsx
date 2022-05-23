import React, { VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Text, TokenLink, Pagination } from '@unique-nft/ui-kit';

import { ViewToken } from '@app/api';
import { getTokenIpfsUriByImagePath } from '@app/utils';

export interface NFTsListComponentProps {
  className?: string;
  tokens?: ViewToken[];
  tokensCount?: number;
  pageChangeHandler: (page: number) => void;
}

const NFTsListComponent: VFC<NFTsListComponentProps> = ({
  className,
  tokens,
  tokensCount,
  pageChangeHandler,
}) => {
  const onPageChange = (page: number) => {
    console.log('page', page);
    pageChangeHandler(page);
  };

  // todo - change the tokenLink props according the data structure
  return (
    <div className={classNames('nft-list', className)}>
      {tokens?.map((t) => (
        <TokenLink
          image={getTokenIpfsUriByImagePath(t.image_path)}
          key={t.token_id}
          link={{
            href: '/',
            title: `${t.token_prefix} [id ${t.token_id}]`,
          }}
          title={`${t.token_prefix} #${t.token_id}`}
        />
      ))}
      <div className="nft-list--footer">
        <Text size="m">{`${tokensCount} items`}</Text>
        <Pagination withIcons size={tokensCount ?? 0} onPageChange={onPageChange} />
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
      padding-top: calc(var(--prop-gap) * 2);
    }
  }
`;
