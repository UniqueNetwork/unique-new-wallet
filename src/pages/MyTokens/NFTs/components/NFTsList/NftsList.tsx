import React, { VFC } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Text, Pagination, TokenLink } from '@unique-nft/ui-kit';

import { ViewToken } from '@app/api';
import { getTokenIpfsUriByImagePath } from '@app/utils';
import { useNFTsContext } from '@app/pages/MyTokens/context';

import { NFTsNotFound } from '../NFTsNotFound';

export interface NFTsListComponentProps {
  className?: string;
  tokens?: ViewToken[];
  tokensCount?: number;
  isLoading: boolean;
}

const NFTsListComponent: VFC<NFTsListComponentProps> = ({
  className,
  tokens,
  tokensCount,
}) => {
  const { tokensPage, changeTokensPage } = useNFTsContext();

  // todo - change the tokenLink props according the data structure
  return (
    <div className={classNames('nft-list', className)}>
      {!isNaN(Number(tokensCount)) && <Text size="m">{`${tokensCount} items`}</Text>}

      {tokensCount === 0 ? (
        <div className="nft-list--empty">
          <NFTsNotFound />
        </div>
      ) : (
        <div className="nft-list--content">
          {tokens?.map((t) => (
            <TokenLink
              image={getTokenIpfsUriByImagePath(t.image_path)}
              key={`${t.collection_id}${t.token_id}`}
              link={{
                href: '/',
                title: `${t.collection_name} #${t.collection_id}`,
              }}
              title={t.token_name}
            />
          ))}
        </div>
      )}
      <div className="nft-list--footer">
        {!!tokensCount && (
          <>
            <Text size="m">{`${tokensCount} items`}</Text>
            <Pagination
              withIcons
              current={tokensPage}
              size={tokensCount}
              onPageChange={changeTokensPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export const NFTsList = styled(NFTsListComponent)`
  height: 100%;
  display: block;

  .nft-list {
    &--empty {
      height: 100%;
      display: flex;
      justify-content: center;
    }
    &--content {
      display: grid;
      grid-gap: calc(var(--prop-gap) * 2);
      grid-template-columns: repeat(3, 326px);
      padding-top: 24px;
    }

    &--footer {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding-top: calc(var(--prop-gap) * 2);
    }
  }
`;
