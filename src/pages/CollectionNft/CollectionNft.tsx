import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';

import { CollectionDescription, NftList } from './components';

interface CollectionNftComponentProps {
  className?: string;
}

const CollectionNftComponent: VFC<CollectionNftComponentProps> = ({ className }) => {
  const { collectionId } = useParams();

  if (!collectionId) {
    return null;
  }

  return (
    <div className={classNames('collection-nft', className)}>
      <CollectionDescription collectionId={collectionId} />
      <NftList collectionId={collectionId} />
    </div>
  );
};

export const CollectionNft = styled(CollectionNftComponent)`
  display: grid;
  grid-template-columns: 291px 1fr;
`;
