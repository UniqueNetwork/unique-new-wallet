import React, { MouseEventHandler, VFC } from 'react';
import { Icon, Text } from '@unique-nft/ui-kit';

import { IdentityIcon } from '@app/components';

import { AccountAddress, AccountGroup, AccountWrapper, AddressCopy } from './styles';

interface AccountInfoProps {
  name?: string;
  address?: string;
  canCopy?: boolean;
  onCopy?: MouseEventHandler<HTMLButtonElement>;
}

export const AccountInfo: VFC<AccountInfoProps> = ({
  name = '',
  address = '',
  canCopy,
  onCopy,
}) => {
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
            <AddressCopy onMouseDown={onCopy}>
              <Icon size={16} name="copy" color="var(--color-blue-grey-400)" />
            </AddressCopy>
          )}
        </AccountAddress>
      </AccountGroup>
    </AccountWrapper>
  );
};
