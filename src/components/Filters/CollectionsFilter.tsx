import React, { FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { Checkbox, Text } from '@unique-nft/ui-kit';
import Accordion from '../Accordion/Accordion';
import { useCollections } from '../../hooks/useCollections';
import Loading from '../Loading';
import { Avatar } from '../Avatar/Avatar';

interface CollectionsFilterProps {
  value?: number[]
  onChange(value: number[]): void
}

const CollectionsFilter: FC<CollectionsFilterProps> = ({ value, onChange }) => {
  const { collections, isFetching } = useCollections();

  const [selectedCollections, setSelectedCollections] = useState<number[]>([]);

  const onCollectionSelect = useCallback((collectionId: number) => (value: boolean) => {
    let _selectedCollections;
    if (value) {
      _selectedCollections = [...selectedCollections, collectionId];
    } else {
      _selectedCollections = selectedCollections.filter((item) => item !== collectionId);
    }
    onChange(_selectedCollections);
    setSelectedCollections(_selectedCollections);
  }, [selectedCollections]);

  const onAttributeSelect = useCallback(() => (value: boolean) => {
    // TODO: filter by attributes
  }, []);

  const onCollectionsClear = useCallback(() => {
    setSelectedCollections([]);
    onChange([]);
  }, [onChange, setSelectedCollections]);

  useEffect(() => {
    setSelectedCollections(value || []);
  }, [value]);

  return (<Accordion title={'Collections'}
    isOpen={true}
    onClear={onCollectionsClear}
    isClearShow={selectedCollections.length > 0}
  >
    <CollectionFilterWrapper>
      {isFetching && <Loading />}
      {collections.map((collection) => (
        <CheckboxWrapper>
          <Checkbox
            checked={selectedCollections.indexOf(collection.id) !== -1}
            label={''}
            size={'m'}
            onChange={onCollectionSelect(collection.id)}
            key={`collection-${collection.id}`}
          />
          <Avatar src={collection.coverImageUrl} size={22} type={'circle'}/>
          <Text>{collection.collectionName}</Text>
        </CheckboxWrapper>
        ))}
    </CollectionFilterWrapper>
    {/* TODO: unsupported on back-end */}
    {false && selectedCollections.length === 1 && <AttributesFilterWrapper>
      {/* TODO: make mapping attributes of the selected collection */}
      <Accordion title={'Traits'} isOpen={true}>
        <CollectionFilterWrapper>
          <Checkbox checked={false}
            label={'Pirate Eye'}
            size={'m'}
            onChange={onAttributeSelect()}
            key={'attribute-'}
          />
        </CollectionFilterWrapper>
      </Accordion>
    </AttributesFilterWrapper>}
  </Accordion>);
};

const CollectionFilterWrapper = styled.div`
  position: relative;
  margin-top: var(--gap);
  padding-top: 2px;
  display: flex;
  flex-direction: column;
  row-gap: var(--gap);
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
  margin-top: calc(var(--gap) * 2);
  display: flex;
  flex-direction: column;
  row-gap: var(--gap);

  .unique-checkbox-wrapper label {
    max-width: 230px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--gap) / 4);
  align-items: center;
`;

export default CollectionsFilter;
