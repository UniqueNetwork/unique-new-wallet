import React, { VFC } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import { PagePaper } from '@app/components';

import { CollectionDescription, CollectionTokenList } from './components';

interface CollectionNftProps {
  className?: string;
}

export const CollectionNft: VFC<CollectionNftProps> = ({ className }) => {
  const { collectionId } = useParams();

  if (!collectionId) {
    return null;
  }

  return (
    <PagePaper.Layout
      className={classNames('collection-nft', className)}
      sidebar={<CollectionDescription collectionId={collectionId} />}
    >
      <CollectionTokenList collectionId={collectionId} />
    </PagePaper.Layout>
  );
};
