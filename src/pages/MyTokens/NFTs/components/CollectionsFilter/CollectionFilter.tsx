import { VFC, useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Accordion } from '@unique-nft/ui-kit';

import { CollectionFilterItem } from './CollectionFilterItem';

export interface CollectionsFilterComponentProps {
  className?: string;
}

export interface Filter {
  collectionIds: string[];
}

export interface Collection {
  id: string;
  name: string;
  coverImage: string;
}

const collections: Collection[] = [
  {
    coverImage:
      'https://ipfs.unique.network/ipfs/QmaPhgoqUVNLi9v6Rfqvx3jp5WyGNMZibWxouWTQqGXG8e',
    id: '2',
    name: 'Chelobrick',
  },
];
const filters: Filter = {
  collectionIds: [],
};

const CollectionsFilterComponent: VFC<CollectionsFilterComponentProps> = ({
  className,
}) => {
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  const onChangeCollectionsFilter = (collectionId: string) => {
    let newIds: string[] = [];

    if (filters.collectionIds.includes(collectionId)) {
      newIds = filters.collectionIds.filter((item) => item !== collectionId);
    } else {
      newIds = [...filters.collectionIds, collectionId];
    }
  };

  return (
    <div className={classNames('collections-filter', className)}>
      <Accordion expanded title="Collections">
        {collections.map((collection) => (
          <CollectionFilterItem
            collectionId={collection.id}
            collectionName={collection.name}
            collectionCover={collection.coverImage}
            onChangeCollectionsFilter={onChangeCollectionsFilter}
          />
        ))}
      </Accordion>
    </div>
  );
};

export const CollectionsFilter = styled(CollectionsFilterComponent)`
  &.collections-filter {
    padding-top: calc(var(--gap)) 0;
  }
`;
