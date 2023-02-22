import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link, Text, Toggle } from '@unique-nft/ui-kit';

import useCopyToClipboard from '@app/hooks/useCopyToClipboard';
import { AccountSelect, Button, Icon } from '@app/components';

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
        <Text color="grey-500" size="s">
          Account
        </Text>
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
            title="Manage accounts"
            color="primery-500"
            className="wallet-link-balance"
            onClick={onManageBalanceClick}
          />
        </div>
        <div className="wallet-content" data-testid="wallet-content">
          <Text size="s" weight="light" color="grey-500">
            Balance
          </Text>
          <Text size="l">{`${balance} ${symbol}`}</Text>
          {deposit && <Text size="s">{`${deposit} ${symbol}`}</Text>}
          {depositDescription}
        </div>
      </div>
      {stake?.visibility && (
        <div className="wallet-accounts-stake">
          <Text size="xs" color="grey-500" weight="light">
            {stake.description}
          </Text>
          <Button
            disabled={stake.disabled}
            title="Stake"
            role="primary"
            onClick={stake.onStake}
          />
        </div>
      )}
      <div className="accounts-manager-networks">
        <Text color="grey-500" size="s" weight="light">
          Active network
        </Text>
        {(!networks || networks.length === 0) && activeNetwork && (
          <div className="network">
            <Icon {...activeNetwork.icon} size={16} />
            <Text>{activeNetwork.name}</Text>
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
                <Text>{network.name}</Text>
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
