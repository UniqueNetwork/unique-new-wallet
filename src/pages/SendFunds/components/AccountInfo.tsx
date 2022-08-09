import React, { VFC } from 'react';
import { Icon, Text } from '@unique-nft/ui-kit';

import {
  AccountAddress,
  AccountGroup,
  AccountWrapper,
  AddressCopy,
} from '@app/pages/SendFunds/components/Style';
import { IdentityIcon } from '@app/components';

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
      <IdentityIcon address={address} />
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
