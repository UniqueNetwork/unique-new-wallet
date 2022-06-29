import { memo, useEffect, useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Checkbox } from '@unique-nft/ui-kit';

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
}) => {
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => setIsChecked(checked), [checked]);

  return (
    <div className={classNames('collection-filter-item', className)}>
      <Checkbox
        label={label}
        checked={isChecked}
        iconLeft={{ size: 22, file: icon }}
        onChange={() => onChange(id)}
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
