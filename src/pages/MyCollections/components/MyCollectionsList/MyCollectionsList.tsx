import React, { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Pagination, Text } from '@unique-nft/ui-kit';
// import { TokenLink } from '@unique-nft/ui-kit';

interface MyCollectionsListComponentProps {
  className?: string;
}

interface MyCollectionWithCount {
  id: string;
  name: string;
  tokensCount: number;
}

const myCollections: MyCollectionWithCount[] = [];

// todo - use TokenLink as a collection card from ui kit
const MyCollectionsListComponent: VFC<MyCollectionsListComponentProps> = ({
  className,
}) => {
  const onPageChange = (page: number) => {
    console.log('page', page);
  };

  return (
    <div className={classNames('my-collections-list', className)}>
      {myCollections.map((myCollection) => (
        <div className="my-collection-card" key={myCollection.id}>
          <span>
            {myCollection.name} [{myCollection.id}]
          </span>
          <p>
            Items: <span>{myCollection.tokensCount}</span>
          </p>
        </div>
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
