import React from 'react';
import { Text } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { shortcutText } from '@app/utils';
import { Avatar } from '@app/components/Avatar/Avatar';
import { Icon } from '@app/components';

import CopyIcon from '../../../static/icons/copy.svg';
import DefaultAvatar from '../../../static/icons/default-avatar.svg';

interface AccountCardProps {
  accountName: string;
  accountAddress: string;
  isShort?: boolean;
  canCopy?: boolean;
  hideAddress?: boolean;
}

const AccountCard = ({
  accountName,
  accountAddress,
  isShort = false,
  canCopy = true,
  hideAddress = false,
}: AccountCardProps) => {
  const onCopyAddress = (account: string) => () => {
    navigator.clipboard.writeText(account);
  };

  return (
    <>
      <Avatar size={24} src={DefaultAvatar} />
      <AccountInfoWrapper>
        <Text>{accountName}</Text>
        {!hideAddress && (
          <AddressRow>
            <Text size="s" color="grey-500">
              {isShort ? shortcutText(accountAddress || '') : accountAddress || ''}
            </Text>
            {canCopy && (
              <a onClick={onCopyAddress(accountAddress || '')}>
                <CopyIconWrapper>
                  <Icon path={CopyIcon} />
                </CopyIconWrapper>
              </a>
            )}
          </AddressRow>
        )}
      </AccountInfoWrapper>
    </>
  );
};

const AccountInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const CopyIconWrapper = styled.div`
  && {
    width: 24px;
    height: 24px;
    color: var(--color-grey-400);
    padding: 0;
    cursor: copy;
    svg {
      transform: translateY(-2px);
    }
  }
`;

const AddressRow = styled.div`
  && {
    display: flex;
    padding: 0;
  }
`;

export default AccountCard;
