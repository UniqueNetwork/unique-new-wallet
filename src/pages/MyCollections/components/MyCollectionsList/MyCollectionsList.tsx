import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { CollectionLink, Pagination, Text } from '@unique-nft/ui-kit';
import { Link, useNavigate } from 'react-router-dom';

interface MyCollectionsListComponentProps {
  className?: string;
}

interface MyCollectionWithCount {
  coverImageUrl: string;
  id: string;
  name: string;
  tokensCount: number;
}

const myCollections: MyCollectionWithCount[] = [];

const MyCollectionsListComponent: VFC<MyCollectionsListComponentProps> = ({
  className,
}) => {
  const navigate = useNavigate();
  const onPageChange = (page: number) => {
    console.log('page', page);
  };

  const onCollectionClick = (collectionId: string) => {
    navigate(`/my-collection/${collectionId}`);
  };

  // todo - change default token link to custom according the design
  return (
    <div className={classNames('my-collections-list', className)}>
      {myCollections.map((myCollection) => (
        <Link key={myCollection.id} to={`/my-collection/${myCollection.id}`}>
          <CollectionLink
            count={myCollection.tokensCount}
            id={myCollection.id}
            image={myCollection.coverImageUrl}
            title={`${myCollection.name}] [${myCollection.id}]`}
          />
        </Link>
      ))}
      <div className="my-collections-list--footer">
        <Text size="m">{`${myCollections.length} items`}</Text>
        <Pagination withIcons size={100} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export const MyCollectionsList = styled(MyCollectionsListComponent)`
  .my-collections-list {
    display: grid;
    grid-template-columns: repeat(5, 1fr);

    &--footer {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding-top: calc(var(--gap) * 2);
    }
  }
`;
