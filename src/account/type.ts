import { Account, AccountSigner } from '@app/account/AccountContext';
import { UnsignedTxPayloadResponse } from '@app/types/Api';

export type BaseWalletType<T> = {
  name: string;
  address: string;
  normalizedAddress: string;
  signerType: AccountSigner;
  walletMetaInformation: T;
  sign(data: any, account?: any, meta?: any): any;
  changeChain(network: string): Promise<void>;
};

export type BaseWalletEntity<T> = {
  changeChain(network: string): Promise<void>;
  getAccounts(): Promise<Map<string, BaseWalletType<T>>>;
  getSignature(
    unsignedTxPayload: UnsignedTxPayloadResponse,
    account: Account,
    meta: any,
  ): any;
};
