import { Ethereum, IEthereumAccountResult } from '@unique-nft/utils/extension';
import { ChainPropertiesResponse, UnsignedTxPayloadResponse } from '@unique-nft/sdk';
import { ethers } from 'ethers';

import { BaseWalletEntity, BaseWalletType } from '@app/account/type';
import { Account, AccountSigner } from '@app/account/AccountContext';

export class MetamaskWallet implements BaseWalletEntity<IEthereumAccountResult> {
  private _accounts = new Map<string, BaseWalletType<IEthereumAccountResult>>();
  isMintingEnabled = false;

  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly chainProperties: ChainPropertiesResponse) {}

  async changeChain(network: string) {
    const chainName = network.toLowerCase();
    const obj: Record<string, () => Promise<void>> = {
      opal: Ethereum.addChain.opal,
      quartz: Ethereum.addChain.quartz,
      unique: Ethereum.addChain.unique,
    };
    const chain = obj[chainName];
    if (chain) {
      await chain();
      return Promise.resolve();
    }
    throw new Error('Chain not found');
  }

  static existExtension() {
    // @ts-ignore
    return Boolean(window.ethereum);
  }

  async getAccounts() {
    if (!MetamaskWallet.existExtension()) {
      throw new Error('Metamask extension not found');
    }
    const res = await Ethereum.getAccounts();

    if (res.error) {
      throw new Error(res.error.message);
    }
    if (!res.address) {
      return new Map();
    }
    this._accounts = new Map([
      [
        res.address,
        {
          name: 'Metamask Account',
          normalizedAddress: res.address,
          address: res.address,
          walletMetaInformation: res,
          signerType: AccountSigner.extension,
          sign: this.getSignature,
          changeChain: this.changeChain.bind(this),
          isMintingEnabled: this.isMintingEnabled,
        },
      ],
    ]);
    return this._accounts;
  }

  getSignature(unsignedTxPayload: UnsignedTxPayloadResponse, selectedAccount: Account) {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getSigner();
  }
}
