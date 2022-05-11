import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { CollectionLink, Pagination, Text } from '@unique-nft/ui-kit';
import { Link } from 'react-router-dom';

import { LisFooter, PaddedBlock } from '@app/styles/styledVariables';

interface MyCollectionsListComponentProps {
  className?: string;
}

interface MyCollectionWithCount {
  coverImageUrl: string;
  id: string;
  name: string;
  tokensCount: number;
}

const myCollections: MyCollectionWithCount[] = [
  {
    id: '1',
    coverImageUrl:
      'https://ipfs.unique.network/ipfs/QmaPhgoqUVNLi9v6Rfqvx3jp5WyGNMZibWxouWTQqGXG8e',
    name: 'Chelobrik',
    tokensCount: 10000,
  },
  {
    id: '2',
    coverImageUrl:
      'https://ipfs.unique.network/ipfs/QmaPhgoqUVNLi9v6Rfqvx3jp5WyGNMZibWxouWTQqGXG8e',
    name: 'Chelobrik',
    tokensCount: 10000,
  },
  {
    id: '3',
    coverImageUrl:
      'https://ipfs.unique.network/ipfs/QmaPhgoqUVNLi9v6Rfqvx3jp5WyGNMZibWxouWTQqGXG8e',
    name: 'Chelobrik',
    tokensCount: 10000,
  },
];

const MyCollectionsListComponent: VFC<MyCollectionsListComponentProps> = ({
  className,
}) => {
  const onPageChange = (page: number) => {
    console.log('page', page);
  };

  // todo - change default token link to custom according the design
  return (
    <div className={classNames('my-collections-list', className)}>
      <List>
        {myCollections.map((myCollection) => (
          <Link key={myCollection.id} to={`/my-collection/${myCollection.id}`}>
            <CollectionLink
              count={myCollection.tokensCount}
              id={myCollection.id}
              image={myCollection.coverImageUrl}
              title={`${myCollection.name} [${myCollection.id}]`}
            />
          </Link>
        ))}
      </List>
      <Footer>
        <Text size="m">{`${myCollections.length} items`}</Text>
        <Pagination withIcons size={100} onPageChange={onPageChange} />
      </Footer>
    </div>
  );
};

const Footer = styled.div`
  ${LisFooter}
`;

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`;

export const MyCollectionsList = styled(MyCollectionsListComponent)`
  ${PaddedBlock};
`;
