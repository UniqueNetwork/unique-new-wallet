import { ChainPropertiesResponse } from '@unique-nft/sdk';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { isEthereumAddress } from '@polkadot/util-crypto';

import { Account, AccountSigner } from '@app/account/AccountContext';
import { AccountUtils } from '@app/account/AccountUtils';
import { UnsignedTxPayloadResponse } from '@app/types/Api';
import { BaseWalletEntity, BaseWalletType } from '@app/account/type';
import { sleep } from '@app/utils';

export class PolkadotWallet implements BaseWalletEntity<InjectedAccountWithMeta> {
  _accounts = new Map<string, BaseWalletType<InjectedAccountWithMeta>>();
  isMintingEnabled = true;

  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly chainProperties: ChainPropertiesResponse) {}

  static async existExtension() {
    let extensions = await web3Enable('unique-minter-wallet');

    if (extensions.length === 0) {
      await sleep(1000);

      extensions = await web3Enable('unique-minter-wallet');
    }
    return extensions.length > 0;
  }

  changeChain(): Promise<void> {
    return Promise.resolve();
  }

  async getAccounts() {
    const existAccount = await PolkadotWallet.existExtension();
    if (!existAccount) {
      throw new Error('Polkadot extension not found');
    }

    const accounts = (await web3Accounts()).filter(
      (account) => !isEthereumAddress(account.address),
    );

    this._accounts = new Map(
      accounts.map((account) => {
        const normalizedAddress = AccountUtils.normalizedAddressAccount(account.address);
        return [
          normalizedAddress,
          {
            name: account.meta.name || '',
            normalizedAddress,
            address: AccountUtils.encodeAddress(
              account.address,
              this.chainProperties.SS58Prefix,
            ),
            walletMetaInformation: account,
            signerType: AccountSigner.extension,
            sign: this.getSignature.bind(this),
            changeChain: this.changeChain.bind(this),
            isMintingEnabled: this.isMintingEnabled,
          },
        ];
      }),
    );

    return this._accounts;
  }

  getSignature = async (
    unsignedTxPayload: UnsignedTxPayloadResponse,
    account: Account<InjectedAccountWithMeta>,
  ) => {
    const injector = await web3FromSource(account.walletMetaInformation.meta.source);
    if (!injector.signer.signPayload) {
      throw new Error('Web3 not available');
    }

    const result = await injector.signer.signPayload(
      unsignedTxPayload?.signerPayloadJSON,
    );

    return result.signature;
  };
}
