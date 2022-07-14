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
      <IconWrapper onClick={onDeleteItem}>
        <Icon color="currentColor" name="close" size={10} />
      </IconWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  &.enum-input--item {
    border-radius: var(--prop-border-radius);
    display: flex;
    align-items: center;
    padding: 1px calc(var(--prop-gap) / 2);
    background-color: var(--color-primary-300);
    color: white;
    font-size: 14px;
    line-height: 22px;
    white-space: nowrap;
  }
`;

const IconWrapper = styled.button`
  border: 0;
  display: flex;
  appearance: none;
  margin-left: 0.1em;
  margin-right: calc(var(--prop-gap) / (-4));
  padding: calc(var(--prop-gap) / 4);
  background: 0 none;
  color: inherit;
  cursor: pointer;
`;

export default EnumInputItem;
