import React from 'react';
import { Text, Icon, useNotifications } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { shortcutText } from '@app/utils';
import { IdentityIcon } from '@app/components';

interface AccountCardProps {
  accountName: string;
  accountAddress: string;
  isShort?: boolean;
  canCopy?: boolean;
  hideAddress?: boolean;
}

const AccountCard = ({
  accountName,
  accountAddress = '',
  isShort = false,
  canCopy = true,
  hideAddress = false,
}: AccountCardProps) => {
  const address = isShort ? shortcutText(accountAddress) : accountAddress;
  const { info } = useNotifications();

  const onCopyAddress = (account: string) => () => {
    info(
      <NotificationInfo>
        Address <i>{account}</i>
        <br />
        successfully copied
      </NotificationInfo>,
    );

    navigator.clipboard.writeText(account);
  };

  return (
    <>
      <IdentityIcon address={address} />
      <AccountInfoWrapper>
        <Text>
          {accountName}
          {/* TODO: no functionality
           <ActionButton>
            <Icon name="pencil" size={16} />
          </ActionButton> */}
        </Text>
        {!hideAddress && (
          <AddressRow>
            {address}
            {canCopy && (
              <ActionButton onClick={onCopyAddress(accountAddress)}>
                <Icon color="currentColor" name="copy" size={16} />
              </ActionButton>
            )}
          </AddressRow>
        )}
      </AccountInfoWrapper>
    </>
  );
};

const NotificationInfo = styled.p`
  word-break: break-all;
`;

const AccountInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-left: calc(var(--prop-gap) / 2);

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

// TODO: no functionality
// const EditIconWrapper = styled.div`
//   && {
//     width: 24px;
//     height: 24px;
//     color: var(--color-grey-400);
//     padding: 0;
//     margin-left: calc(var(--prop-gap) / 2);
//     cursor: pointer;
//     display: inline-block;
//   }
// `;

const AddressRow = styled.span`
  display: flex;
  align-items: center;
  padding: 0;
  color: var(--color-grey-500);
`;

const ActionButton = styled.button.attrs({ type: 'button' })`
  appearance: none;
  border: 0;
  padding: 4px;
  background: none transparent;
  color: inherit;
  cursor: pointer;

  &:hover,
  &:focus-within {
    color: var(--color-primary-500);
  }

  .icon {
    display: block;
  }
`;

export default AccountCard;
