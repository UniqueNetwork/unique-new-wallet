import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import useCopyToClipboard from '@app/hooks/useCopyToClipboard';
import { AccountSelect, Button, Icon, Typography, Toggle } from '@app/components';

import { AccountsManagerProps } from '../../AccountsManager';

import './AccountsManagerDropdown.scss';

export const AccountsManagerDropdown = ({
  accounts,
  selectedAccount,
  networks,
  activeNetwork,
  deposit,
  depositDescription,
  balance,
  symbol,
  manageBalanceLink,
  onAccountChange,
  onNetworkChange,
  onManageBalanceClick,
  stake,
  onCopyAddressClick,
}: AccountsManagerProps) => {
  const [copied, copy] = useCopyToClipboard();

  useEffect(() => {
    copied && onCopyAddressClick?.(copied);
  }, [copied, onCopyAddressClick]);

  return (
    <div className="accounts-manager-dropdown">
      <div className="accounts-manager-accounts">
        <Typography color="grey-500" size="s">
          Account
        </Typography>
        <Select
          defaultValue={selectedAccount}
          isClearable={false}
          isSearchable={false}
          shortenLabel={true}
          options={accounts}
          onChange={onAccountChange as any}
        />
      </div>
      <div className="accounts-manager-wallet">
        <div className="wallet-link" data-testid="wallet-link">
          <Link
            color="primery-500"
            className="wallet-link-balance"
            to={manageBalanceLink || ''}
            onClick={onManageBalanceClick}
          >
            Manage accounts
          </Link>
        </div>
        <div className="wallet-content" data-testid="wallet-content">
          <Typography size="s" weight="light" color="grey-500">
            Balance
          </Typography>
          <Typography size="l">{`${balance} ${symbol}`}</Typography>
          {deposit && <Typography size="s">{`${deposit} ${symbol}`}</Typography>}
          {depositDescription}
        </div>
      </div>
      {stake?.visibility && (
        <div className="wallet-accounts-stake">
          <Typography size="xs" color="grey-500" weight="light">
            {stake.description}
          </Typography>
          <Button
            disabled={stake.disabled}
            title="Stake"
            role="primary"
            onClick={stake.onStake}
          />
        </div>
      )}
      <div className="accounts-manager-networks">
        <Typography color="grey-500" size="s" weight="light">
          Active network
        </Typography>
        {(!networks || networks.length === 0) && activeNetwork && (
          <div className="network">
            <Icon {...activeNetwork.icon} size={16} />
            <Typography>{activeNetwork.name}</Typography>
          </div>
        )}
        {networks?.length > 0 && (
          <div className="networks-list">
            {networks.map((network) => (
              <div
                className="network"
                key={`network-${network.id}`}
                data-testid={`network-${network.id}`}
              >
                <Icon {...network.icon} size={16} />
                <Typography>{network.name}</Typography>
                <Toggle
                  label=""
                  on={activeNetwork?.id === network.id}
                  onChange={() => onNetworkChange?.(network)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Select = styled(AccountSelect)`
  .account-select {
    &__control,
    &__option {
      height: calc(var(--prop-gap) * 3.5);
      cursor: pointer;
    }
  }
`;
