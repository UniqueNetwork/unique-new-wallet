import { VFC, useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Accordion } from '@unique-nft/ui-kit';

import { Collection } from '@app/api/graphQL';
import { getCollectionCoverUri } from '@app/utils';

import { CollectionFilterItem } from './CollectionFilterItem';

export interface CollectionsFilterComponentProps {
  className?: string;
  collections?: Collection[];
}

export interface Filter {
  collectionIds: string[];
}

const filters: Filter = {
  collectionIds: [],
};

const CollectionsFilterComponent: VFC<CollectionsFilterComponentProps> = ({
  className,
  collections,
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
        {collections?.map((collection) => (
          <CollectionFilterItem
            key={collection.collection_id}
            collectionName={collection.name}
            collectionId={collection.collection_id?.toString()}
            collectionCover={getCollectionCoverUri(collection)}
            onChangeCollectionsFilter={onChangeCollectionsFilter}
          />
        ))}
      </Accordion>
    </div>
  );
};

export const CollectionsFilter = styled(CollectionsFilterComponent)`
  &.collections-filter {
    padding-top: calc(var(--prop-gap)) 0;
  }
`;
