import { VFC, useState } from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { Accordion } from '@unique-nft/ui-kit';

import { CollectionPreview } from '@app/api';

import { CollectionFilterItem } from './CollectionFilterItem';

export interface CollectionsFilterComponentProps {
  className?: string;
  collections?: CollectionPreview[];
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
            collectionName={collection.collection_name}
            collectionId={collection.collection_id?.toString()}
            collectionCover="" // waiting hasura rework
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
