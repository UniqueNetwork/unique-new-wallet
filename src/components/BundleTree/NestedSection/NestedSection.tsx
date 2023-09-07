import { FC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import NoTrades from 'static/icons/no-trades.svg';

import { DeviceSize, useApi, useDeviceSize } from '@app/hooks';
import { NoItems, Loader, Typography } from '@app/components';
import { AngelHackBaseCollectionId } from '@app/pages/MyTokens/constants';

import { INestedSectionView, INestingToken } from '../types';
import { useCollection } from '../useCollection';
import TokenCard from './TokenCard';

export const NestedSection: FC<INestedSectionView<INestingToken>> = ({
  selectedToken,
  onViewNodeDetails,
  onUnnestClick,
  onTransferClick,
}) => {
  const { currentChain } = useApi();
  const deviceSize = useDeviceSize();
  const { isCollectionLoading, collection } = useCollection(selectedToken?.collectionId);

  return deviceSize >= DeviceSize.lg ||
    selectedToken?.collectionId === AngelHackBaseCollectionId[currentChain.network] ? (
    <NestedDetails
      className={classNames({ _empty: !selectedToken?.nestingChildTokens?.length })}
    >
      {selectedToken?.nestingChildTokens?.length ? (
        <TitleWrapper>
          <Title
            token={selectedToken}
            isCollectionLoading={isCollectionLoading}
            prefix={collection?.tokenPrefix || ''}
          />
        </TitleWrapper>
      ) : null}

      {!selectedToken?.nestingChildTokens?.length && (
        <NoItems file={NoTrades} title="No nested tokens" />
      )}

      {!!selectedToken?.nestingChildTokens?.length && (
        <NestedTokens>
          {selectedToken.nestingChildTokens.map((token) => (
            <TokenCard
              key={`T-${token.tokenId} C-${token.collectionId}`}
              token={token}
              onViewNodeDetails={onViewNodeDetails}
              onUnnestClick={onUnnestClick}
              onTransferClick={onTransferClick}
            />
          ))}
        </NestedTokens>
      )}
    </NestedDetails>
  ) : null;
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
    <Typography color="additional-dark" size="l">
      Nested in {prefix} #{token.tokenId}
    </Typography>
  );
};

const NestedDetails = styled.div`
  overflow: auto;
  flex: 1 1 auto;
  padding: var(--prop-gap) calc(var(--prop-gap) * 2);
  background: rgba(237, 237, 238, 0.5);

  &._empty {
    @media (min-width: 1024px) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const NestedTokens = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
`;

const TitleWrapper = styled.div`
  padding-bottom: var(--gap);
`;
