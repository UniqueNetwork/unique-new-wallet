import React from 'react';
import styled from 'styled-components/macro';
import { Text } from '@unique-nft/ui-kit';

import { Icon } from '@app/components';

import LogOut from '../../../static/icons/log-out.svg';

interface AccountContextMenuProps {
  onForgetWalletClick(): void;
}

export const AccountContextMenu = ({ onForgetWalletClick }: AccountContextMenuProps) => (
  <>
    <ContextMenuItem onClick={onForgetWalletClick}>
      <Icon size={24} path={LogOut} />
      <Text>Forget wallet</Text>
    </ContextMenuItem>
  </>
);

const ContextMenuItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  padding: calc(var(--prop-gap) / 4) calc(var(--prop-gap) / 2) !important;
  &:hover {
    background-color: var(--color-primary-100);
    span.unique-text {
      color: var(--color-primary-500);
    }
    svg > path {
      fill: var(--color-primary-500);
    }
  }
`;
