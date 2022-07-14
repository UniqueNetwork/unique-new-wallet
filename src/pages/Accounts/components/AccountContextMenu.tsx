import React from 'react';
import styled from 'styled-components/macro';
import { Icon, Text } from '@unique-nft/ui-kit';

interface AccountContextMenuProps {
  onForgetWalletClick(): void;
}

export const AccountContextMenu = ({ onForgetWalletClick }: AccountContextMenuProps) => (
  <ContextMenuItem onClick={onForgetWalletClick}>
    <Icon size={24} name="logout" color="currentColor" />
    <Text>Forget wallet</Text>
  </ContextMenuItem>
);

const ContextMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: calc(var(--prop-gap) * 0.75) var(--prop-gap);
  color: var(--color-additional-dark);
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: var(--color-primary-500);
    background-color: var(--color-primary-100);

    span.unique-text {
      color: inherit;
    }
  }
`;
