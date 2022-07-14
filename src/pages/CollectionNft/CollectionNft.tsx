import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';

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
    <Wrapper className={classNames('collection-nft', className)}>
      <CollectionDescription collectionId={collectionId} />
      <NftList collectionId={collectionId} />
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 291px 1fr;
`;
