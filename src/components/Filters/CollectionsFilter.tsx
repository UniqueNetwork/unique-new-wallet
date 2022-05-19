import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Checkbox, Text } from '@unique-nft/ui-kit';

import { useCollections } from '@app/hooks';

import Accordion from '../Accordion/Accordion';
import Loading from '../Loading';
import { Avatar } from '../Avatar/Avatar';

interface CollectionsFilterProps {
  value?: number[];
  onChange(value: number[]): void;
}

const CollectionsFilter: FC<CollectionsFilterProps> = ({ value, onChange }) => {
  const { collections, isFetching } = useCollections();

  const [selectedCollections, setSelectedCollections] = useState<number[]>([]);

  const onCollectionSelect = useCallback(
    (collectionId: number) => (value: boolean) => {
      let _selectedCollections;
      if (value) {
        _selectedCollections = [...selectedCollections, collectionId];
      } else {
        _selectedCollections = selectedCollections.filter(
          (item) => item !== collectionId,
        );
      }
      onChange(_selectedCollections);
      setSelectedCollections(_selectedCollections);
    },
    [selectedCollections],
  );

  const onAttributeSelect = useCallback(
    () => (value: boolean) => {
      // TODO: filter by attributes
    },
    [],
  );

  const onCollectionsClear = useCallback(() => {
    setSelectedCollections([]);
    onChange([]);
  }, [onChange, setSelectedCollections]);

  useEffect(() => {
    setSelectedCollections(value || []);
  }, [value]);

  return (
    <Accordion
      title={'Collections'}
      isOpen={true}
      isClearShow={selectedCollections.length > 0}
      onClear={onCollectionsClear}
    >
      <CollectionFilterWrapper>
        {isFetching && <Loading />}
        {collections?.map((collection) => (
          <CheckboxWrapper>
            <Checkbox
              checked={selectedCollections.indexOf(collection.id) !== -1}
              label={''}
              size={'m'}
              key={`collection-${collection.id}`}
              onChange={onCollectionSelect(collection.id)}
            />
            <Avatar src={collection.coverImageUrl} size={22} type={'circle'} />
            <Text>{collection.collectionName}</Text>
          </CheckboxWrapper>
        ))}
      </CollectionFilterWrapper>
    </Accordion>
  );
};

const CollectionFilterWrapper = styled.div`
  position: relative;
  margin-top: var(--prop-gap);
  padding-top: 2px;
  display: flex;
  flex-direction: column;
  row-gap: var(--prop-gap);
  min-height: 50px;
  max-height: 400px;
  overflow-y: auto;
  .unique-checkbox-wrapper label {
    max-width: 230px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;
const AttributesFilterWrapper = styled.div`
  margin-top: calc(var(--prop-gap) * 2);
  display: flex;
  flex-direction: column;
  row-gap: var(--prop-gap);

  .unique-checkbox-wrapper label {
    max-width: 230px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--prop-gap) / 4);
  align-items: center;
`;

export default CollectionsFilter;
