import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import moment from 'moment';
import { Avatar } from '@unique-nft/ui-kit';

import { Grey100, Grey300, Grey500, Secondary500 } from '@app/styles/colors';
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
  // todo - modify collection card in UI kit or update styles here
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
            <strong>{moment.utc().format('MMMM, D, YYYY, HH:mm:ss UTC')}</strong>
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

// todo - change color to css var
const CollectionVerticalCard = styled.div`
  display: flex;
  flex-direction: column;
  ${PaddedBlock};
  grid-row-gap: var(--gap);

  strong {
    font-weight: normal;
    color: ${Secondary500};
  }
`;

// todo - change color to css var
const Row = styled.div`
  display: flex;
  grid-column-gap: var(--gap);
  align-items: center;
  color: ${Grey500};
`;

const Description = styled.div`
  padding: var(--gap) 0;
  border-top: 1px dashed ${Grey300};
  border-bottom: 1px dashed ${Grey300};
`;

// todo - change color to var
export const Badge = styled.div`
  background: ${Grey100};
  border-radius: 4px;
  font-family: var(--font-main);
  font-size: 14px;
  line-height: 22px;
  color: ${Secondary500};
  padding: calc(var(--gap) / 4) calc(var(--gap) / 2);
  height: 22px;
`;

export const CollectionDescription = styled(CollectionDescriptionComponent)`
  border-right: 1px solid ${Grey300};

  .unique-collection-card {
    overflow: hidden;
    word-break: break-all;
  }
`;
