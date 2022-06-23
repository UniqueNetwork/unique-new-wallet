import React, { VFC } from 'react';
import styled from 'styled-components';
import { Icon } from '@unique-nft/ui-kit';

interface Props {
  deleteItem: (enumItem: string) => void;
  enumItem: string;
}

const EnumInputItem: VFC<Props> = ({ deleteItem, enumItem }) => {
  const onDeleteItem = () => {
    deleteItem(enumItem);
  };

  return (
    <Wrapper className="enum-input--item">
      {enumItem}
      <div onClick={onDeleteItem}>
        <Icon name="close" size={12} />
      </div>
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

    svg {
      cursor: pointer;
      display: block !important;

      path {
        fill: white;
      }
    }
  }
`;

export default EnumInputItem;
