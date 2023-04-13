import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { useNotifications } from '@unique-nft/ui-kit';

import { shortcutText } from '@app/utils';
import { DeviceSize, useDeviceSize } from '@app/hooks';
import { Link, Icon, IdentityIcon } from '@app/components';

interface AccountCardProps {
  accountAddress: string;
  accountName?: string;
  accountType?: string;
  hideAddress?: boolean;
  canCopy?: boolean;
  chainLogo?: string;
  scanLink?: string;
  isShort?: boolean;
}

const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const AccountInfoWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: calc(100% - 24px);
  padding-left: calc(var(--prop-gap) / 2);
  line-height: 1.5;

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

  a {
    display: inline;
    font-size: 16px;
    &:hover {
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 0.3em;
    }

    &.primary {
      color: var(--color-primary-500);
    }
  }
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
  isShort,
  canCopy = true,
  chainLogo,
  hideAddress = false,
  scanLink,
}: AccountCardProps) => {
  const { info, error } = useNotifications();

  const deviceSize = useDeviceSize();
  const address = isShort
    ? shortcutText(accountAddress)
    : deviceSize <= DeviceSize.xs
    ? shortcutText(accountAddress)
    : accountAddress;

  const onCopyAddress = (account: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (account) {
      info('Address copied successfully');
      navigator.clipboard.writeText(account);
    } else {
      error('Address not found');
    }
  };

  return (
    <Wrapper>
      {chainLogo ? (
        <Icon name={chainLogo} size={24} />
      ) : (
        <IdentityIcon address={accountAddress} />
      )}
      <AccountInfoWrapper>
        {(accountName || accountType) && (
          <AccountInfoText>
            {accountName && (
              <span
                title={accountName.length > 20 ? accountName : undefined}
                className="truncate-text"
              >
                {accountName}
              </span>
            )}
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
        )}
        {!hideAddress && (
          <AddressRow title={accountAddress}>
            {scanLink ? (
              <Link
                className={classNames({ 'truncate-text': !isShort })}
                href={scanLink}
                target="_blank"
                rel="noreferrer noopener"
              >
                {address}
              </Link>
            ) : (
              <span className={classNames({ 'truncate-text': !isShort })}>{address}</span>
            )}
            {canCopy && (
              <ActionButton title="Copy address" onClick={onCopyAddress(accountAddress)}>
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
