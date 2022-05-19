import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { format } from 'date-fns';
import { Avatar } from '@unique-nft/ui-kit';

import { AccountLinkComponent, CollectionScanLink } from '@app/components';
import { PaddedBlock } from '@app/styles/styledVariables';

interface CollectionDescriptionComponentProps {
  className?: string;
  collectionId: string;
}

const CollectionDescriptionComponent: VFC<CollectionDescriptionComponentProps> = ({
  className,
  collectionId,
}) => {
  // todo - fetch from api
  return (
    <div className={classNames('collection-description', className)}>
      <CollectionVerticalCard>
        <Row>
          <Avatar
            src="https://ipfs.unique.network/ipfs/QmaPhgoqUVNLi9v6Rfqvx3jp5WyGNMZibWxouWTQqGXG8e"
            type="circle"
          />
          <Badge>ID: {collectionId}</Badge>
        </Row>
        <Row>
          <span>
            items: <strong>800</strong>
          </span>
          <span>
            Symbol: <strong>Chel</strong>
          </span>
        </Row>
        <Row>
          <span>
            Sponsor:{' '}
            <AccountLinkComponent value="5DM1n2TnsRcVHQHt2FVkreztcJr9ghqdq6jsmxupgJRiT3m7" />
          </span>
        </Row>
        <Row>
          <span>
            Token limit: <strong>20 000</strong>
          </span>
        </Row>
        <Row>
          <span>
            Date of creation:{' '}
            <strong>
              {format(
                new Date(new Date().toISOString().slice(0, -1)),
                'MMMM, d, yyyy, HH:mm:ss',
              )}{' '}
              UTC
            </strong>
          </span>
        </Row>
        <Description>
          Adopt yourself a Duckie and join The Flock.Each Duck is a 1 of 1
          programmatically generated with a completely unique combination of traits. No
          two are identical. In total there are 5000 Duckies. Stay up to date on drops by
          joining the Discord and following
        </Description>
        <CollectionScanLink collectionId={collectionId} />
      </CollectionVerticalCard>
    </div>
  );
};

const CollectionVerticalCard = styled.div`
  display: flex;
  flex-direction: column;
  ${PaddedBlock};
  grid-row-gap: var(--prop-gap);

  strong {
    font-weight: normal;
    color: var(--color-secondary-500);
  }
`;

const Row = styled.div`
  display: flex;
  grid-column-gap: var(--prop-gap);
  align-items: center;
  color: var(--color-grey-500);
`;

const Description = styled.div`
  padding: var(--prop-gap) 0;
  border-top: 1px dashed var(--color-grey-300);
  border-bottom: 1px dashed var(--color-grey-300);
`;

export const Badge = styled.div`
  background: var(--color-grey-100);
  border-radius: 4px;
  font-family: var(--prop-font-family);
  font-size: 14px;
  line-height: 22px;
  color: var(--color-secondary-500);
  padding: calc(var(--prop-gap) / 4) calc(var(--prop-gap) / 2);
  height: 22px;
`;

export const CollectionDescription = styled(CollectionDescriptionComponent)`
  border-right: 1px solid var(--color-grey-300);

  .unique-collection-card {
    overflow: hidden;
    word-break: break-all;
  }
`;
