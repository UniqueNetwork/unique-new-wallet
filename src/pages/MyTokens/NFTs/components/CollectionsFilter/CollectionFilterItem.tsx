import { memo, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import { Checkbox, Typography } from '@app/components';
import noImage from '@app/static/icons/no-collections.svg';

export interface CollectionFilterItemComponentProps {
  id: number;
  icon: string;
  label: string;
  checked: boolean;
  className?: string;
  onChange: (collectionId: number) => void;
}

const CollectionFilterItemComponent: VFC<CollectionFilterItemComponentProps> = ({
  className,
  id,
  icon,
  label,
  checked,
  onChange,
}) => (
  <div className={classNames('collection-filter-item', className)}>
    <Checkbox
      label={
        <LabelWrapper title={label.length > 15 ? label : undefined}>
          <Typography className="collection-filter-item-name" size="s">
            {label}
          </Typography>
          <Typography size="s" color="grey-500">
            [{id}]
          </Typography>
        </LabelWrapper>
      }
      checked={checked}
      iconLeft={{ size: 22, file: icon || noImage }}
      onChange={() => onChange(id)}
    />
  </div>
);

const CollectionFilterItemStyled = styled(CollectionFilterItemComponent)`
  &.collection-filter-item {
    margin-top: 16px;
  }
  .collection-filter-item-name {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    flex: 1;
  }

  .unique-checkbox-wrapper {
    width: 100%;
    label {
      flex: 1;
      & > span {
        flex: 1;
        display: flex;
      }
    }
  }
  .unique-checkbox-wrapper .checkbox-label img {
    object-fit: cover;
  }
`;

const LabelWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  width: 146px;
  overflow: hidden;
`;

export const CollectionFilterItem = memo(CollectionFilterItemStyled);
