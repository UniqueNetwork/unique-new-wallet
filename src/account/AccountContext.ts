import { Consumer, Context, createContext, Provider } from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { BN } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';

export enum AccountSigner {
  extension = 'Extension',
  local = 'Local'
}
export interface Account extends InjectedAccountWithMeta {
  signerType: AccountSigner,
  balance?: {
    KSM?: BN
  }
}

export type AccountContextProps = {
  isLoading: boolean
  accounts: Account[]
  selectedAccount: Account | undefined
  fetchAccountsError: string | undefined
  changeAccount(account: Account): void
  setSelectedAccount(account: Account): void
  setFetchAccountsError(error: string | undefined): void
  setAccounts(accounts: Account[]): void
  setIsLoading(loading: boolean): void
  showSignDialog(): Promise<KeyringPair>
}

const AccountContext: Context<AccountContextProps> = createContext({} as unknown as AccountContextProps);
const AccountConsumer: Consumer<AccountContextProps> = AccountContext.Consumer;
const AccountProvider: Provider<AccountContextProps> = AccountContext.Provider;

export default AccountContext;

export { AccountConsumer, AccountProvider };
