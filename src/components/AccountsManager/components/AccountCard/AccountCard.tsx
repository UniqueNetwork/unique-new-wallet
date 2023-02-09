import { Avatar, Text } from '@unique-nft/ui-kit';
import React, { ReactNode } from 'react';

import useCopyToClipboard from '@app/hooks/useCopyToClipboard';
import { Icon } from '@app/components';

import defaultAvatarSrc from '../../../../static/icons/avatar.jpg';
import { IAccount } from '../../AccountsManager';

import './AccountCard.scss';
interface AccountCardProps extends IAccount {
  avatarRender?(address: string): ReactNode;
}

export const AccountCard = ({ name, address, avatarRender }: AccountCardProps) => {
  const shortAddress =
    address && address?.length > 13
      ? `${address.slice(0, 5)}...${address.slice(-5)}`
      : address;

  const [copied, copy] = useCopyToClipboard();

  return (
    <div className="account-card">
      {avatarRender && address ? (
        avatarRender(address)
      ) : (
        <Avatar src={defaultAvatarSrc} type="circle" />
      )}
      <div className="account-card-content">
        <Text size="m">{name}</Text>
        <div className="account-card-address">
          <Text size="s" color="grey-500">
            {shortAddress}
          </Text>
          <div
            className="address-copy"
            data-testid={`address-copy-${address}`}
            onClick={(event) => {
              event.stopPropagation();
              copy(address!);
            }}
          >
            <Icon size={16} name="copy" />
          </div>
        </div>
      </div>
    </div>
  );
};
