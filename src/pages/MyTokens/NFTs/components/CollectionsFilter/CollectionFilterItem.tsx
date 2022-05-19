import { VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Checkbox } from '@unique-nft/ui-kit';

export interface CollectionFilterItemComponentProps {
  className?: string;
  collectionId: string;
  collectionName: string;
  collectionCover: string;
  onChangeCollectionsFilter: (collectionId: string) => void;
}

const CollectionFilterItemComponent: VFC<CollectionFilterItemComponentProps> = (props) => {
  const {
    className,
    collectionId,
    collectionName,
    collectionCover,
    onChangeCollectionsFilter
  } = props;

  const onChange = () => {
    onChangeCollectionsFilter(collectionId);
  };

  return (
    <div className={classNames('collection-filter-item', className)}>
      <Checkbox
        checked
        iconLeft={{
          size: 15,
          file: collectionCover,
        }}
        label={collectionName}
        onChange={onChange}
      />
    </div>
  );
};

export const CollectionFilterItem = styled(CollectionFilterItemComponent)``;
