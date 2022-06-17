import React, { memo, VFC, useCallback } from 'react';
import styled from 'styled-components';

import closeIcon from './closeIcon.svg';

interface Props {
  deleteItem: (enumItem: string) => void;
  enumItem: string;
}

const EnumInputItem: VFC<Props> = ({ deleteItem, enumItem }) => {
  const onDeleteItem = useCallback(() => {
    deleteItem(enumItem);
  }, [deleteItem, enumItem]);

  return (
    <Wrapper className="enum-input--item">
      {enumItem}
      <img alt="delete item" src={closeIcon} onClick={onDeleteItem} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  &.enum-input--item {
    font-size: 14px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    background-color: var(--color-primary-500);
    border-radius: 8px;
    color: white;
    grid-column-gap: 8px;
    line-height: 16px;
    white-space: nowrap;

    img {
      width: 12px;
      height: 12px;
      cursor: pointer;
      display: block !important;
    }
  }
`;

export default memo(EnumInputItem);
