import React, { VFC } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';

import {
  InnerContent,
  InnerSidebar,
  InnerWrapper,
} from '@app/pages/components/PageComponents';

import { CollectionDescription, NftList } from './components';

interface CollectionNftProps {
  className?: string;
}

export const CollectionNft: VFC<CollectionNftProps> = ({ className }) => {
  const { collectionId } = useParams();

  if (!collectionId) {
    return null;
  }

  return (
    <InnerWrapper className={classNames('collection-nft', className)}>
      <InnerSidebar>
        <CollectionDescription collectionId={collectionId} />
      </InnerSidebar>
      <InnerContent>
        <NftList collectionId={collectionId} />
      </InnerContent>
    </InnerWrapper>
  );
};
