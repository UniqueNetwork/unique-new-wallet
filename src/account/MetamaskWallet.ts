import { Ethereum, IEthereumExtensionResultSafe } from '@unique-nft/utils/extension';
import { ChainPropertiesResponse, UnsignedTxPayloadResponse } from '@unique-nft/sdk';
import { ethers } from 'ethers';

import { BaseWalletEntity, BaseWalletType } from '@app/account/type';
import { Account, AccountSigner } from '@app/account/AccountContext';

export const MetamaskAccountName = 'Metamask Account';
export const MetamaskDefaultDecimals = 18;

export class MetamaskWallet
  implements BaseWalletEntity<IEthereumExtensionResultSafe['result']>
{
  private _accounts = new Map<
    string,
    BaseWalletType<IEthereumExtensionResultSafe['result']>
  >();

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
    const res = await Ethereum.getAccountsSafe();

    if (res.error) {
      throw new Error(res.error.message);
    }
    if (!res.result.address) {
      return new Map();
    }
    this._accounts = new Map([
      [
        res.result.address,
        {
          name: MetamaskAccountName,
          normalizedAddress: res.result.address,
          address: res.result.address,
          walletMetaInformation: res.result,
          signerType: AccountSigner.extension,
          sign: this.getSignature,
          changeChain: this.changeChain.bind(this),
          isMintingEnabled: this.isMintingEnabled,
        },
      ],
    ]);
    return this._accounts;
  }

  getSignature(unsignedTxPayload?: UnsignedTxPayloadResponse, selectedAccount?: Account) {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider.getSigner();
  }
}
