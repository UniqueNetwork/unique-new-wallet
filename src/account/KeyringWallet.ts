import { ChainPropertiesResponse, UnsignedTxPayloadResponse } from '@unique-nft/sdk';
import { u8aToHex } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

import { BaseWalletEntity, BaseWalletType } from '@app/account/type';
import { AccountUtils } from '@app/account/AccountUtils';
import { Account, AccountSigner } from '@app/account/AccountContext';

export class KeyringWallet implements BaseWalletEntity<KeyringAddress> {
  private _accounts = new Map<string, BaseWalletType<KeyringAddress>>();

  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly chainProperties: ChainPropertiesResponse) {}

  getAccounts() {
    const keyringAccounts = keyring.getAccounts();
    this._accounts = new Map(
      keyringAccounts.map((account) => {
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
            signerType: AccountSigner.local,
            sign: this.getSignature,
            changeChain: this.changeChain.bind(this),
          },
        ];
      }),
    );

    return Promise.resolve(this._accounts);
  }

  static existExtension() {
    return true;
  }

  changeChain(network: string): Promise<void> {
    return Promise.resolve();
  }

  getSignature = (
    unsignedTxPayload: UnsignedTxPayloadResponse,
    account: Account,
    { password }: { password: string },
  ) => {
    const keyringPair = keyring.getPair(account.address);
    keyringPair.unlock(password);

    if (!keyringPair) {
      throw new Error('Unable to decode using the supplied passphrase');
    }
    const { signerPayloadHex } = unsignedTxPayload;

    const signature = u8aToHex(
      keyringPair.sign(signerPayloadHex, {
        withType: true,
      }),
    );

    return Promise.resolve(signature);
  };
}
