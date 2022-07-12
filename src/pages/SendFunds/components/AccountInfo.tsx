import React, { VFC } from 'react';
import { Avatar, Icon, Text } from '@unique-nft/ui-kit';

import DefaultAvatar from '@app/static/icons/default-avatar.svg';
import {
  AccountAddress,
  AccountGroup,
  AccountWrapper,
  AddressCopy,
} from '@app/pages/SendFunds/components/Style';

export const AccountInfo: VFC<{ name?: string; address?: string; canCopy?: boolean }> = ({
  name = '',
  address = '',
  canCopy,
}) => {
  const copyAddress = (address: string) => {
    void navigator.clipboard.writeText(address);
  };

  return (
    <AccountWrapper>
      <Avatar size={24} src={DefaultAvatar} />
      <AccountGroup>
        <Text>{name}</Text>
        <AccountAddress>
          <Text color="inherit" size="s">
            {address}
          </Text>
          {canCopy && (
            <AddressCopy onClick={() => copyAddress(address)}>
              <Icon size={14} name="copy" color="currentColor" />
            </AddressCopy>
          )}
        </AccountAddress>
      </AccountGroup>
    </AccountWrapper>
  );
};
