import { Button, Dropdown, Icon, Link, Text, Toggle } from '@unique-nft/ui-kit';
import React, { useEffect } from 'react';

import useCopyToClipboard from '@app/hooks/useCopyToClipboard';

import { AccountsManagerProps } from '../../AccountsManager';
import { AccountCard } from '../index';
import './AccountsManagerDropdown.scss';

export const AccountsManagerDropdown = ({
  accounts,
  selectedAccount,
  networks,
  activeNetwork,
  deposit,
  depositDescription,
  manageBalanceLinkTitle,
  balance,
  symbol,
  isTouch,
  stakeVisibility,
  isStakeDisabled,
  avatarRender,
  onAccountChange,
  onNetworkChange,
  onManageBalanceClick,
  onCopyAddressClick,
  onStakeClick,
}: AccountsManagerProps) => {
  const [copied, copy] = useCopyToClipboard();

  useEffect(() => {
    copied && onCopyAddressClick?.(copied);
  }, [copied]);

  return (
    <div className="accounts-manager-dropdown">
      <div className="accounts-manager-accounts">
        <Text color="grey-500" size="s">
          Account
        </Text>
        <Dropdown
          optionKey="address"
          options={accounts}
          optionRender={(option) => (
            <AccountCard
              {...option}
              avatarRender={avatarRender}
              onCopyAddressClick={copy}
            />
          )}
          iconRight={{
            name: 'triangle',
            size: 8,
          }}
          isTouch={isTouch}
          onChange={onAccountChange}
        >
          <div className="accounts-select" data-testid="accounts-select">
            <AccountCard
              {...selectedAccount}
              avatarRender={avatarRender}
              onCopyAddressClick={copy}
            />
          </div>
        </Dropdown>
      </div>
      <div className="accounts-manager-wallet">
        <Text color="grey-500" size="s">
          Wallet
        </Text>
        <div className="wallet-content" data-testid="wallet-content">
          <Text size="l">{`${balance} ${symbol}`}</Text>
          {deposit && <Text size="s">{`${deposit} ${symbol}`}</Text>}
          {depositDescription}
          {manageBalanceLinkTitle && (
            <div className="wallet-link" data-testid="wallet-link">
              <Link title={manageBalanceLinkTitle} onClick={onManageBalanceClick} />
              <Icon size={12} name="arrow-right" color="var(--color-primary-500)" />
            </div>
          )}
        </div>
      </div>
      {stakeVisibility && (
        <Button
          title="Stake"
          role="primary"
          disabled={isStakeDisabled}
          onClick={onStakeClick}
        />
      )}
      <div className="accounts-manager-networks">
        <Text color="grey-500" size="s">
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
