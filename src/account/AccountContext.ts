import { Consumer, Context, createContext, Provider } from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { KeyringPair } from '@polkadot/keyring/types';

import { AllBalancesResponse } from '@app/types/Api';
import { NetworkType } from '@app/types';

export enum AccountSigner {
  extension = 'Extension',
  local = 'Local',
}

export interface Account extends InjectedAccountWithMeta {
  balance?: AllBalancesResponse;
  unitBalance: NetworkType;
  signerType: AccountSigner;
  collectionsTotal?: number;
  tokensTotal?: number;
  /*
   * При смене чейна у нас меняется address.
   * Необходимо добавить статический адрес, который не меняется
   * К примеру, при смене чейна, у нас ранее скидывался аккаунт на дефолтный ввиду того, что менялся его address
   * */
  normalizedAddress: string;
}

export type AccountContextProps = {
  isLoading: boolean;
  signer?: Account;
  accounts: Account[];
  selectedAccount: Account | undefined;
  fetchAccounts: () => Promise<void>;
  fetchAccountsError: string | undefined;
  changeAccount(account: Account): void;
  setFetchAccountsError(error: string | undefined): void;
  setAccounts(accounts: Account[]): void;
  setIsLoading(loading: boolean): void;
  showSignDialog(signer: Account): Promise<KeyringPair>;
  forgetLocalAccount(addressWallet: string): void;
};

const AccountContext: Context<AccountContextProps> = createContext(
  {} as unknown as AccountContextProps,
);
const AccountConsumer: Consumer<AccountContextProps> = AccountContext.Consumer;
const AccountProvider: Provider<AccountContextProps> = AccountContext.Provider;

export default AccountContext;

export { AccountConsumer, AccountProvider };
