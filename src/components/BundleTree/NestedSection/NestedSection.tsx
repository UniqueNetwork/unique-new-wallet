import React, { FC } from 'react';
import { Text, Loader, Icon } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import NoTrades from 'static/icons/no-trades.svg';

import { INestedSectionView, INestingToken } from '../types';
import TokenCard from './TokenCard';
import { useCollection } from '../useCollection';

export const NestedSection: FC<INestedSectionView<INestingToken>> = ({
  selectedToken,
  onViewNodeDetails,
  onUnnestClick,
  onTransferClick,
}) => {
  const { isCollectionLoading, collection } = useCollection(selectedToken?.collectionId);
  return (
    <NestedDetails>
      {selectedToken?.nestingChildTokens?.length && (
        <TitleWrapper>
          <Title
            token={selectedToken}
            isCollectionLoading={isCollectionLoading}
            prefix={collection?.tokenPrefix || ''}
          />
        </TitleWrapper>
      )}
      {!selectedToken?.nestingChildTokens?.length && (
        <NoNestedWrapper>
          <Icon file={NoTrades} size={80} />
          <Text color="grey-500" size="m">
            No nested tokens
          </Text>
        </NoNestedWrapper>
      )}
      {!!selectedToken?.nestingChildTokens?.length && (
        <NestedTokens>
          {selectedToken.nestingChildTokens.map((token) => (
            <TokenCard
              // @ts-ignore
              key={`T-${token.tokenId} C-${token.collectionId}`}
              // @ts-ignore
              token={token}
              onViewNodeDetails={onViewNodeDetails}
              onUnnestClick={onUnnestClick}
              onTransferClick={onTransferClick}
            />
          ))}
        </NestedTokens>
      )}
    </NestedDetails>
  );
};

const Title = ({
  isCollectionLoading,
  prefix,
  token,
}: {
  isCollectionLoading: boolean;
  prefix: string;
  token: INestingToken;
}) => {
  if (isCollectionLoading) {
    return <Loader size="large" />;
  }
  return (
    <Text color="additional-dark" size="l">
      Nested in {prefix} #{token.tokenId}
    </Text>
  );
};

const NestedDetails = styled.div`
  display: block;
  padding: 16px 32px;
  background-color: #ededee50;
  width: calc(100% - 536px);
  height: 373px;
  overflow: auto;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    display: none;
  }
`;

const NestedTokens = styled.div`
  margin-top: var(--gap);
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoNestedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: var(--gap);
  width: 100%;
  height: 100%;
`;
