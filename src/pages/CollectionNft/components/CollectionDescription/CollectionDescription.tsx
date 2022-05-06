import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import moment from 'moment';
import { CollectionCard } from '@unique-nft/ui-kit';

import { Grey300 } from '@app/styles/colors';

interface CollectionDescriptionComponentProps {
  className?: string;
  collectionId: string;
}

// todo - use TokenLink as a collection card from ui kit
const CollectionDescriptionComponent: VFC<CollectionDescriptionComponentProps> = ({
  className,
  collectionId,
}) => {
  // todo - fetch from api
  // todo - modify collection card in UI kit or update styles here
  const collectionName = 'Chelobrik';
  const tokenPrefix = 'Chel';
  const owner = '5DM1n2TnsRcVHQHt2FVkreztcJr9ghqdq6jsmxupgJRiT3m7';
  const sponsor = '5DM1n2TnsRcVHQHt2FVkreztcJr9ghqdq6jsmxupgJRiT3m7';
  const tokenCount = 800;
  const tokenLimit = 20000;
  const dateOfCreation = moment.utc().format('MMMM, D, YYYY, HH:mm:ss UTC');
  const description =
    'Adopt yourself a Duckie and join The Flock.Each Duck is a 1 of 1 programmatically generated with a completely unique combination of traits. No two are identical. In total there are 5000 Duckies. Stay up to date on drops by joining the Discord and following';
  const meta = {
    id: collectionId,
    items: tokenCount,
    owner,
    symbol: tokenPrefix,
  };

  return (
    <div className={classNames('collection-description', className)}>
      <CollectionCard title={collectionName} meta={meta} />
      {dateOfCreation}
    </div>
  );
};

export const CollectionDescription = styled(CollectionDescriptionComponent)`
  border-right: 1px solid ${Grey300};

  .unique-collection-card {
    overflow: hidden;
    word-break: break-all;
  }
`;
