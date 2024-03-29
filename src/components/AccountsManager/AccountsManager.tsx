import { ReactNode, useEffect } from 'react';

import useCopyToClipboard from '@app/hooks/useCopyToClipboard';
import { Account } from '@app/account';
import { Dropdown, Icon, Typography, IconProps, useNotifications } from '@app/components';

import { isTouchDevice } from '../../utils';
import { AccountsManagerDropdown } from './components';

import './AccountsManager.scss';

interface SelectOptionProps {
  [x: string | number | symbol]: unknown;
  iconLeft?: IconProps;
  iconRight?: IconProps;
}
export interface IAccount extends SelectOptionProps {
  address?: string;
  name?: string;
}

export interface INetwork {
  id: string;
  name: string;
  icon: IconProps;
}

export interface AccountsManagerProps {
  open?: boolean;
  accounts: Account[];
  selectedAccount?: Account;
  networks: INetwork[];
  activeNetwork?: INetwork;
  balance: string;
  deposit?: string;
  depositDescription?: ReactNode;
  manageBalanceLinkTitle?: string;
  manageBalanceLink?: string;
  symbol: string;
  isLoading?: boolean;
  isTouch?: boolean;
  stake?: {
    visibility?: boolean;
    disabled?: boolean;
    onStake?: () => void;
    description?: string;
  };
  verticalOffset?: number | string;
  avatarRender?(address: string): ReactNode;
  onNetworkChange?(network: INetwork): void;
  onAccountChange?(account: Account): void;
  onManageBalanceClick?(): void;
  onOpenChange?(open: boolean): void;
  onCopyAddressClick?(address: string): void;
}

export const AccountsManager = (props: AccountsManagerProps) => {
  const {
    open,
    selectedAccount,
    activeNetwork,
    balance,
    symbol,
    isTouch,
    verticalOffset,
    onOpenChange,
    onCopyAddressClick,
  } = props;

  const [copied, copy] = useCopyToClipboard();
  const touchDevice = isTouch || isTouchDevice;
  const { info } = useNotifications();

  useEffect(() => {
    copied && onCopyAddressClick?.(copied);
  }, [copied]);

  return (
    <Dropdown
      dropdownRender={() => <AccountsManagerDropdown {...props} isTouch={touchDevice} />}
      iconRight={{
        name: 'triangle',
        size: 8,
      }}
      placement="right"
      open={open}
      isTouch={touchDevice}
      verticalOffset={verticalOffset}
      onOpenChange={onOpenChange}
    >
      <div className="unique-accounts-manager">
        <div className="accounts-manager-selected-account">
          <div className="accounts-manager-selected-account-name">
            <Typography
              color="blue-grey-500"
              size="s"
              title={
                selectedAccount?.name && selectedAccount.name.length > 12
                  ? selectedAccount.name
                  : undefined
              }
            >
              {selectedAccount?.name}
            </Typography>
            <button
              className="address-copy"
              type="button"
              title="Copy address to clipboard"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                copy(`${selectedAccount?.address}`);
                info(`Address copied successfully`);
              }}
            >
              <Icon size={16} name="copy" />
            </button>
          </div>
          <Typography
            className="selected-balance"
            size="s"
          >{`${balance} ${symbol}`}</Typography>
        </div>
        <div className="accounts-manager-network">
          {activeNetwork && (
            <Icon {...activeNetwork.icon} className="active-network-icon" size={16} />
          )}
        </div>
      </div>
    </Dropdown>
  );
};
