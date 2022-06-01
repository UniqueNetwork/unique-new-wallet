import { memo, useCallback, useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Checkbox } from '@unique-nft/ui-kit';

export interface CollectionFilterItemComponentProps {
  id: number;
  icon: string;
  label: string;
  className?: string;
  onChange: (collectionId: number) => void;
}

const CollectionFilterItemComponent: VFC<CollectionFilterItemComponentProps> = ({
  className,
  id,
  icon,
  label,
  onChange,
}) => {
  const [checked, setChecked] = useState(false);

  const onChangeHandler = useCallback((checked: boolean) => {
    setChecked(checked);
    onChange(id);
  }, []);

  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  return (
    <div
      style={{ backgroundColor: `#${randomColor}` }}
      className={classNames('collection-filter-item', className)}
    >
      <Checkbox
        label={label}
        checked={checked}
        iconLeft={{ size: 15, file: icon }}
        onChange={onChangeHandler}
      />
    </div>
  );
};

const CollectionFilterItemStyled = styled(CollectionFilterItemComponent)`
  &.collection-filter-item {
    margin-top: 16px;
  }
`;

export const CollectionFilterItem = memo(CollectionFilterItemStyled);
