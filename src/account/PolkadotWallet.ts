import { ChainPropertiesResponse } from '@unique-nft/sdk';
import { IPolkadotExtensionAccount, Polkadot } from '@unique-nft/utils/extension';

import { Account, AccountSigner } from '@app/account/AccountContext';
import { AccountUtils } from '@app/account/AccountUtils';
import { UnsignedTxPayloadResponse } from '@app/types/Api';
import { BaseWalletEntity, BaseWalletType } from '@app/account/type';

export class PolkadotWallet implements BaseWalletEntity<IPolkadotExtensionAccount> {
  _accounts = new Map<string, BaseWalletType<IPolkadotExtensionAccount>>();

  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly chainProperties: ChainPropertiesResponse) {}

  static async existExtension() {
    const result = await Polkadot.enableAndLoadAllWallets();
    return result.info.extensionFound;
  }

  changeChain(): Promise<void> {
    return Promise.resolve();
  }

  async getAccounts() {
    const existAccount = await PolkadotWallet.existExtension();
    if (!existAccount) {
      throw new Error('Polkadot extension not found');
    }

    const { accounts } = await Polkadot.enableAndLoadAllWallets();

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
          },
        ];
      }),
    );

    return this._accounts;
  }

  getSignature = async (
    unsignedTxPayload: UnsignedTxPayloadResponse,
    account: Account<IPolkadotExtensionAccount>,
  ) => {
    const result = await account.walletMetaInformation.signPayload(
      unsignedTxPayload?.signerPayloadJSON,
    );

    return result.signature;
  };
}
