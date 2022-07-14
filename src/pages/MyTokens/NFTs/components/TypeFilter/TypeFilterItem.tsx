import { memo, useEffect, useState, VFC } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Checkbox } from '@unique-nft/ui-kit';

import { TypeFilter } from '@app/api/graphQL/tokens';

export interface TypeFilterItemComponentProps {
  id: TypeFilter;
  label: string;
  checked: boolean;
  className?: string;
  onChange: (typeId: TypeFilter) => void;
}

const TypeFilterItemComponent: VFC<TypeFilterItemComponentProps> = ({
  id,
  label,
  onChange,
  className,
  checked,
}) => (
  <div className={classNames('type-filter-item', className)}>
    <Checkbox checked={checked} label={label} onChange={() => onChange(id)} />
  </div>
);

const TypeFilterItemStyled = styled(TypeFilterItemComponent)`
  &.type-filter-item {
    margin-top: var(--prop-gap);
  }
`;

export const TypeFilterItem = memo<TypeFilterItemComponentProps>(TypeFilterItemStyled);
