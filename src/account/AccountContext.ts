import { Consumer, Context, createContext, Provider } from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { IEthereumExtensionResultSafe } from '@unique-nft/utils/extension';

import { AllBalancesResponse } from '@app/types/Api';
import { NetworkType } from '@app/types';
import { BaseWalletType } from '@app/account/type';
import { useWalletCenter } from '@app/account/useWalletCenter';

export enum AccountSigner {
  extension = 'Extension',
  local = 'Local',
}

export type WalletsType =
  | InjectedAccountWithMeta
  | KeyringAddress
  | IEthereumExtensionResultSafe['result'];

export type Account<T extends WalletsType = WalletsType> = BaseWalletType<T> & {
  balance?: AllBalancesResponse;
  withdrawBalance?: AllBalancesResponse;
  unitBalance?: NetworkType;
  collectionsTotal?: number;
  tokensTotal?: number;
};

export type AccountContextProps = {
  isLoading: boolean;
  signer?: Account;
  accounts: Map<string, Account>;
  selectedAccount: Account | undefined;
  fetchAccountsError: string | undefined;
  changeAccount(account: Account): void;
  setFetchAccountsError(error: string | undefined): void;
  setIsLoading(loading: boolean): void;
  showSignDialog(signer: Account): Promise<string>;
  forgetLocalAccount(addressWallet: string): void;
  walletsCenter: ReturnType<typeof useWalletCenter>;
};

const AccountContext: Context<AccountContextProps> = createContext(
  {} as unknown as AccountContextProps,
);
const AccountConsumer: Consumer<AccountContextProps> = AccountContext.Consumer;
const AccountProvider: Provider<AccountContextProps> = AccountContext.Provider;

export default AccountContext;

export { AccountConsumer, AccountProvider };
