import { ReactNode, useEffect } from 'react';
import { Dropdown, Icon, IconProps, Text } from '@unique-nft/ui-kit';

import useCopyToClipboard from '@app/hooks/useCopyToClipboard';

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
  accounts: IAccount[];
  selectedAccount?: IAccount;
  networks: INetwork[];
  activeNetwork?: INetwork;
  balance: string;
  deposit?: string;
  depositDescription?: ReactNode;
  manageBalanceLinkTitle?: string;
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
  onAccountChange?(account: IAccount): void;
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
          <Icon size={20} name="user" />
          <div className="accounts-manager-selected-account-name">
            <Text color="blue-grey-500" size="s">
              {selectedAccount?.name}
            </Text>
            <div
              className="address-copy"
              data-testid={`selected-address-copy-${selectedAccount?.address}`}
              onClick={(event) => {
                event.stopPropagation();
                copy(`${selectedAccount?.address}`);
              }}
            >
              <Icon size={16} name="copy" />
            </div>
          </div>
          <Text className="selected-balance" size="s">{`${balance} ${symbol}`}</Text>
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
