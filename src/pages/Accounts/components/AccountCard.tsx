import React from 'react';
import styled from 'styled-components';
import { Icon, useNotifications } from '@unique-nft/ui-kit';

import { shortcutText } from '@app/utils';
import { IdentityIcon } from '@app/components';

interface AccountCardProps {
  accountName: string;
  chainLogo?: string;
  accountType?: string;
  accountAddress: string;
  isShort?: boolean;
  canCopy?: boolean;
  hideAddress?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const NotificationInfo = styled.p`
  word-break: break-all;
`;

const AccountInfoWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: calc(100% - 24px);
  padding-left: calc(var(--prop-gap) / 2);

  .truncate-text {
    overflow: hidden;
    min-width: 2rem;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const AccountInfoText = styled.span`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-additional-dark);
`;

const AccountInfoParams = styled.span`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  margin-left: 0.25em;
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

const AccountCard = ({
  accountName,
  accountType,
  accountAddress = '',
  isShort = false,
  canCopy = true,
  chainLogo,
  hideAddress = false,
}: AccountCardProps) => {
  const address = isShort ? shortcutText(accountAddress) : accountAddress;
  const { info, error } = useNotifications();

  const onCopyAddress = (account: string) => () => {
    if (account) {
      info(
        <NotificationInfo>
          Address <i>{account}</i>
          <br />
          successfully copied
        </NotificationInfo>,
      );

      navigator.clipboard.writeText(account);
    } else {
      error(<NotificationInfo>Address not found</NotificationInfo>);
    }
  };

  return (
    <Wrapper>
      {chainLogo ? (
        <Icon name={chainLogo} size={24} />
      ) : (
        <IdentityIcon address={address} />
      )}
      <AccountInfoWrapper>
        <AccountInfoText>
          <span className="truncate-text">{accountName}</span>
          {accountType && (
            <AccountInfoParams>
              ({accountType})
              {/* TODO: no functionality
              <ActionButton>
                <Icon name="pencil" size={16} />
              </ActionButton> */}
            </AccountInfoParams>
          )}
        </AccountInfoText>
        {!hideAddress && (
          <AddressRow>
            <span className="truncate-text">{address}</span>
            {canCopy && (
              <ActionButton onClick={onCopyAddress(accountAddress)}>
                <Icon color="currentColor" name="copy" size={16} />
              </ActionButton>
            )}
          </AddressRow>
        )}
      </AccountInfoWrapper>
    </Wrapper>
  );
};

export default AccountCard;
