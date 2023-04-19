import React, { MouseEventHandler, TouchEventHandler, VFC } from 'react';
import { Icon, Typography } from '../';

import { IdentityIcon } from '@app/components';

import { AccountAddress, AccountGroup, AccountWrapper, AddressCopy } from './styles';

interface AccountInfoProps {
  name?: string;
  address?: string;
  canCopy?: boolean;
  onCopy?: MouseEventHandler<HTMLButtonElement> | TouchEventHandler<HTMLButtonElement>;
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
        {name && <Typography>{name}</Typography>}
        <AccountAddress>
          <Typography className="address-text" weight="light" color="inherit" size="s">
            {address}
          </Typography>
          {canCopy && (
            <AddressCopy onMouseDown={onCopy as MouseEventHandler<HTMLButtonElement>}>
              <Icon size={16} name="copy" color="var(--color-blue-grey-400)" />
            </AddressCopy>
          )}
        </AccountAddress>
      </AccountGroup>
    </AccountWrapper>
  );
};
