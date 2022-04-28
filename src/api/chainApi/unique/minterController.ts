import Web3 from 'web3';
import { ApiPromise } from '@polkadot/api';
import { BN } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

import { sleep } from '@app/utils';

import minterPlaceAbi from './abi/minterPlaceAbi.json';
import nonFungibleAbi from './abi/nonFungibleAbi.json';
import {
  CrossAccountId,
  IMinterController,
  INFTController,
  TransactionOptions,
} from '../types';
import {
  compareEncodedAddresses,
  getEthAccount,
  isTokenOwner,
  normalizeAccountId,
} from '../utils/addressUtils';

export type EvmCollectionAbiMethods = {
  approve: (
    contractAddress: string,
    tokenId: string,
  ) => {
    encodeABI: () => any;
  };
  getApproved: (tokenId: string | number) => {
    call: () => Promise<string>;
  };
};

export type TokenAskType = {
  flagActive: '0' | '1';
  ownerAddr: string;
  price: BN;
};

export type MinterPlaceAbiMethods = {
  addAsk: (
    price: string,
    currencyCode: string,
    address: string,
    tokenId: string,
  ) => {
    encodeABI: () => any;
  };
  balanceKSM: (ethAddress: string) => {
    call: () => Promise<string>;
  };
  buyKSM: (
    collectionAddress: string,
    tokenId: string,
    buyer: string,
    receiver: string,
  ) => {
    encodeABI: () => any;
  };
  cancelAsk: (
    collectionId: string,
    tokenId: string,
  ) => {
    encodeABI: () => any;
  };
  depositKSM: (price: number) => {
    encodeABI: () => any;
  };
  getOrder: (
    collectionId: string,
    tokenId: string,
  ) => {
    call: () => Promise<TokenAskType>;
  };
  getOrdersLen: () => {
    call: () => Promise<number>;
  };
  orders: (orderNumber: number) => {
    call: () => Promise<TokenAskType>;
  };
  setEscrow: (escrow: string) => {
    encodeABI: () => any;
  };
  // (amount: string, currencyCode: string, address: string) => any;
  withdraw: (
    amount: string,
    currencyCode: string,
    address: string,
  ) => {
    encodeABI: () => any;
  };
  withdrawAllKSM: (ethAddress: string) => {
    encodeABI: () => any;
  };
};

// TODO: Global todo list
/*
1. Split into two controllers: kusama and uniq one
1.2. Consider moving unq methods into token controller instead
*/
// TODO: Ideas
/*
1. Mixins. Inherit from tokenController, inherit from collectionController, create multiple controllers for buy/sell/etc
2. Modules (sell module, buy module, etc.) that accepts rawApi's
 */
export type MinterControllerConfig = {
  contractAddress?: string;
  contractOwner?: string;
  uniqueSubstrateApiRpc?: string;
  escrowAddress?: string;
  minterPlaceAbi?: any;
  minPrice?: number;
  kusamaDecimals?: number;
  defaultGasAmount?: number;
  auctionAddress?: string;
  nftController?: INFTController<any, any>;
};

const defaultMinterPlaceControllerConfig: MinterControllerConfig = {
  contractAddress: '',
  contractOwner: '0x396421AEE95879e8B50B9706d5FCfdeA6162eD1b', // ???
  escrowAddress: '',
  minPrice: 0.000001,
  kusamaDecimals: 12,
  defaultGasAmount: 2500000,
};

class MinterController implements IMinterController {
  private uniqApi: ApiPromise;
  private kusamaApi: ApiPromise;
  private contractAddress: string;
  private contractOwner: string; // ???
  private uniqueSubstrateApiRpc: string;
  private escrowAddress: string;
  private minPrice: number;
  private kusamaDecimals: number;
  private web3Instance: Web3;
  private defaultGasAmount: number;
  private auctionAddress: string;
  private nftController: INFTController<any, any>;

  constructor(
    uniqApi: ApiPromise,
    kusamaApi: ApiPromise,
    config: MinterControllerConfig = {},
  ) {
    this.uniqApi = uniqApi;
    this.kusamaApi = kusamaApi;
    const options = { ...defaultMinterPlaceControllerConfig, ...config };
    if (!options.contractAddress) throw new Error('Contract address not found');
    this.contractAddress = options.contractAddress;
    if (!options.contractOwner) throw new Error('Contract owner not provided');
    this.contractOwner = options.contractOwner; // ???
    if (!options.uniqueSubstrateApiRpc)
      throw new Error('Uniq substrate rpc not provided');
    this.uniqueSubstrateApiRpc = options.uniqueSubstrateApiRpc;
    if (!options.escrowAddress) throw new Error('Escrow address is not provided');
    this.escrowAddress = options.escrowAddress;
    if (!options.minPrice) throw new Error('Min price not provided');
    this.minPrice = options.minPrice;
    if (!options.kusamaDecimals) throw new Error('Kusama decimals not provided');
    this.kusamaDecimals = options.kusamaDecimals; // TODO: could and should be taken from kusamaApi
    this.defaultGasAmount = options.defaultGasAmount || 2500000;
    if (!options.nftController) throw new Error('NFTController not provided');
    this.nftController = options.nftController;
    if (!options.auctionAddress) throw new Error('Auction address not provided');
    this.auctionAddress = options.auctionAddress;
    const provider = new Web3.providers.WebsocketProvider(this.uniqueSubstrateApiRpc, {
      reconnect: {
        auto: true,
        delay: 5000,
        maxAttempts: 5,
        onTimeout: false,
      },
    });

    const web3 = new Web3(provider);
    this.web3Instance = web3;
  }

  // #region helpers
  private getMatcherContractInstance(ethAccount: string): {
    methods: MinterPlaceAbiMethods;
  } {
    return new this.web3Instance.eth.Contract(
      // @ts-ignore
      minterPlaceAbi.abi,
      this.contractAddress,
      {
        from: ethAccount,
      },
    );
  }

  // TODO: can be moved to utils
  private collectionIdToAddress(address: number): string {
    if (address >= 0xffffffff || address < 0) {
      throw new Error('id overflow');
    }

    const buf = Buffer.from([
      0x17,
      0xc4,
      0xe6,
      0x45,
      0x3c,
      0xc4,
      0x9a,
      0xaa,
      0xae,
      0xac,
      0xa8,
      0x94,
      0xe6,
      0xd9,
      0x68,
      0x3e,
      address >> 24,
      (address >> 16) & 0xff,
      (address >> 8) & 0xff,
      address & 0xff,
    ]);

    return Web3.utils.toChecksumAddress('0x' + buf.toString('hex'));
  }

  private getEvmCollectionInstance(collectionId: string): {
    methods: EvmCollectionAbiMethods;
    options: any;
  } {
    return new this.web3Instance.eth.Contract(
      // @ts-ignore
      nonFungibleAbi,
      this.collectionIdToAddress(parseInt(collectionId, 10)),
      { from: this.contractOwner },
    );
  }

  // #endregion

  private async repeatCheckForTransactionFinish(
    checkIfCompleted: () => Promise<boolean>,
    options: {
      maxAttempts: boolean;
      awaitBetweenAttempts: number;
    } | null = null,
  ): Promise<void> {
    let attempt = 0;
    const maxAttempts = options?.maxAttempts || 100;
    const awaitBetweenAttempts = options?.awaitBetweenAttempts || 2 * 1000;

    while (attempt < maxAttempts) {
      const isCompleted = await checkIfCompleted();
      if (isCompleted) return;
      attempt++;
      await sleep(awaitBetweenAttempts);
    }

    throw new Error('Awaiting tx execution timed out');
  }

  // #region sell
  public async checkWhiteListed(account: string): Promise<boolean> {
    const ethAddress = getEthAccount(account);
    try {
      return (
        await this.uniqApi.query.evmContractHelpers.allowlist(
          this.contractAddress,
          ethAddress,
        )
      ).toJSON();
    } catch (e) {
      console.error('Check for whitelist failed', e);
      throw e;
    }
  }

  public async addToWhiteList(
    account: string,
    options: TransactionOptions,
  ): Promise<void> {
    const ethAddress = getEthAccount(account);
    const isWhiteListed = await this.checkWhiteListed(ethAddress);
    if (isWhiteListed) {
      return;
    }
    const minDeposit = this.kusamaApi?.consts.balances?.existentialDeposit;

    const tx = this.kusamaApi.tx.balances.transfer(this.escrowAddress, minDeposit);
    const signedTx = await options.sign(tx);

    if (!signedTx) throw new Error('Breaking transaction');

    try {
      await signedTx.send();
      await this.repeatCheckForTransactionFinish(
        async () => await this.checkWhiteListed(account),
      );
      return;
    } catch (e) {
      console.error('addToWhiteList error pushed upper');
      throw e;
    }
    // execute tx
  }

  private async checkOnEth(
    account: string,
    collectionId: string,
    tokenId: string,
  ): Promise<boolean> {
    const token = await this.nftController.getToken(
      Number(collectionId),
      Number(tokenId),
    );
    return isTokenOwner(account, token.owner);
  }

  // transfer to etherium
  public async lockNftForSale(
    account: string,
    collectionId: string,
    tokenId: string,
    options: TransactionOptions,
  ) {
    // check if already on eth
    const ethAccount = {
      Ethereum: getEthAccount(account),
    };

    const isOnEth = await this.checkOnEth(ethAccount.Ethereum, collectionId, tokenId);
    if (isOnEth) return;

    const tx = this.uniqApi.tx.unique.transfer(
      normalizeAccountId(ethAccount),
      collectionId,
      tokenId,
      1,
    );
    const signedTx = await options.sign(tx);

    if (!signedTx) throw new Error('Transaction cancelled');

    try {
      await signedTx.send();

      await this.repeatCheckForTransactionFinish(async () => {
        return this.checkOnEth(ethAccount.Ethereum, collectionId, tokenId);
      });
      return;
    } catch (e) {
      console.error('lockNftForSale error pushed upper');
      throw e;
    }
  }

  private async checkIfNftApproved(
    tokenOwner: CrossAccountId,
    collectionId: string,
    tokenId: string,
  ): Promise<boolean> {
    const approvedCount = // prettier-ignore
      (
        await this.uniqApi.rpc.unique.allowance(
          collectionId,
          normalizeAccountId(tokenOwner),
          normalizeAccountId({ Ethereum: this.contractAddress }),
          tokenId,
        )
      ).toJSON() as number;

    if (approvedCount === 1) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  // aprove token
  public async sendNftToSmartContract(
    account: string,
    collectionId: string,
    tokenId: string,
    options: TransactionOptions,
  ): Promise<void> {
    // TODO: same here
    if (!this.nftController) throw new Error('NFTController is not available');

    const token = await this.nftController.getToken(
      Number(collectionId),
      Number(tokenId),
    );

    const evmCollectionInstance = this.getEvmCollectionInstance(collectionId);
    const approved = await this.checkIfNftApproved(token.owner, collectionId, tokenId);

    const abi = evmCollectionInstance.methods
      .approve(this.contractAddress, tokenId)
      .encodeABI();

    if (approved) {
      return;
    }
    const tx = this.uniqApi.tx.evm.call(
      getEthAccount(account),
      evmCollectionInstance.options.address,
      abi,
      0,
      this.defaultGasAmount,
      await this.web3Instance.eth.getGasPrice(),
      null,
      null,
      [],
    );
    const signedTx = await options.sign(tx);

    if (!signedTx) throw new Error('Transaction cancelled');

    await signedTx.send();

    await this.repeatCheckForTransactionFinish(async () => {
      return this.checkIfNftApproved(token.owner, collectionId, tokenId);
    });
  }

  private async checkAsk(account: string, collectionId: string, tokenId: string) {
    const ethAddress = getEthAccount(account);
    const matcherContractInstance = this.getMatcherContractInstance(ethAddress);

    const { flagActive, ownerAddr, price }: TokenAskType =
      await matcherContractInstance.methods
        .getOrder(this.collectionIdToAddress(parseInt(collectionId, 10)), tokenId)
        .call();

    if (ownerAddr.toLowerCase() === ethAddress.toLowerCase() && flagActive === '1') {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  // checkAsk - put on sale
  public async setForFixPriceSale(
    account: string,
    collectionId: string,
    tokenId: string,
    price: string,
    options: TransactionOptions,
  ): Promise<void> {
    const ethAddress = getEthAccount(account);
    const evmCollectionInstance = this.getEvmCollectionInstance(collectionId);
    const matcherContractInstance = this.getMatcherContractInstance(ethAddress);

    const abi = matcherContractInstance.methods
      .addAsk(
        this.fromStringToBnString(price, this.kusamaDecimals),
        '0x0000000000000000000000000000000000000001',
        evmCollectionInstance.options.address,
        tokenId,
      )
      .encodeABI();

    const tx = this.uniqApi.tx.evm.call(
      getEthAccount(account),
      this.contractAddress,
      abi,
      0,
      this.defaultGasAmount,
      await this.web3Instance.eth.getGasPrice(),
      null,
      null,
      [],
    );

    const signedTx = await options.sign(tx);

    if (!signedTx) throw new Error('Transaction cancelled');

    await signedTx.send();

    try {
      await this.repeatCheckForTransactionFinish(async () => {
        return this.checkAsk(account, collectionId, tokenId);
      });

      await sleep(30 * 1000);

      return;
    } catch (e) {
      console.error('setForFixPriceSale error pushed upper');
      throw e;
    }
  }

  // #endregion sell
  // #region buy

  // checkDepositReady
  private async getUserDeposit(account: string): Promise<BN> {
    const ethAccount = getEthAccount(account);

    const matcherContractInstance = this.getMatcherContractInstance(ethAccount);
    const result = await matcherContractInstance.methods /* as MinterPlaceAbiMethods */
      .balanceKSM(ethAccount)
      .call();

    if (result) {
      const deposit = new BN(result);

      // Number(this.formatKsm(deposit)) > minPrice ? localStorage.setItem('deposit', JSON.stringify(result)) : localStorage.removeItem('deposit'); // TODO: figure out what we have been saving in localStorage and why

      return deposit;
    }

    throw new Error('Failed to get user deposit');
  }

  // TODO: utils
  private formatKsm(value: BN) {
    if (!value || value.toString() === '0') {
      return '0';
    }

    // const tokenDecimals = incomeDecimals || formatBalance.getDefaults().decimals;
    const tokenDecimals = this.kusamaDecimals; // TODO:

    if (value.lte(new BN(this.minPrice * Math.pow(10, tokenDecimals)))) {
      return ` ${this.minPrice}`;
    }

    // calculate number after decimal point
    const decNum = value?.toString().length - tokenDecimals;
    let balanceStr = '';

    if (decNum < 0) {
      balanceStr = [
        '0',
        '.',
        ...Array.from('0'.repeat(Math.abs(decNum))),
        value.toString(),
      ].join('');
    }

    if (decNum > 0) {
      balanceStr = [
        value.toString().substr(0, decNum),
        '.',
        value.toString().substr(decNum, tokenDecimals - decNum),
      ].join('');
    }

    if (decNum === 0) {
      balanceStr = [
        '0',
        '.',
        value.toString().substr(decNum, tokenDecimals - decNum),
      ].join('');
    }

    const arr = balanceStr.toString().split('.');

    return `${arr[0]}${arr[1] ? `.${arr[1].substr(0, this.kusamaDecimals)}` : ''}`;
  }

  // TODO: we have 3 outcomes ('already enough funds'/'not enough funds, sign to add'/'not enough funds on account'), will collide with UI since we expect bool from here and nahve no control over stages texts
  public async addDeposit(
    account: string,
    collectionId: string,
    tokenId: string,
    options: TransactionOptions,
  ): Promise<void> {
    const matcherContractInstance = this.getMatcherContractInstance(
      getEthAccount(account),
    );
    const userDeposit = await this.getUserDeposit(account);
    if (!userDeposit) throw new Error('No user deposit');
    const token = await this.nftController?.getToken(
      Number(collectionId),
      Number(tokenId),
    );
    if (!token) throw new Error('Token not found');
    const ask = await matcherContractInstance.methods
      .getOrder(this.collectionIdToAddress(Number(collectionId)), tokenId)
      .call();
    if (!ask?.price) throw new Error('Token has no price');
    const price = new BN(ask.price);
    if (price.lte(userDeposit)) {
      // Deposit already exists
      return;
    }
    // Get required amount to deposit
    const needed = price.sub(userDeposit);
    const kusamaBalancesAll = await this.kusamaApi?.derive.balances?.all(account);
    const kusamaAvailableBalance = new BN(kusamaBalancesAll?.availableBalance); // TODO: some complicated stuff to be migrated

    if (kusamaAvailableBalance?.lt(needed)) {
      throw new Error(
        `Your KSM balance is too low: ${this.formatKsm(
          kusamaAvailableBalance,
        )} KSM. You need at least: ${this.formatKsm(needed)} KSM`,
      );
    }
    // accountId: encodedKusamaAccount,
    const tx = this.kusamaApi.tx.balances.transfer(this.escrowAddress, needed);
    const signedTx = await options.sign(tx);

    if (!signedTx) throw new Error('Transaction cancelled');

    await signedTx.send();
    await this.repeatCheckForTransactionFinish(async () => {
      return price.lte(await this.getUserDeposit(account));
    });
  }

  // buyToken
  public async buyToken(
    account: string,
    collectionId: string,
    tokenId: string,
    options: TransactionOptions,
  ) {
    const ethAccount = getEthAccount(account);
    const evmCollectionInstance = this.getEvmCollectionInstance(collectionId);
    const matcherContractInstance = this.getMatcherContractInstance(ethAccount);
    const abi = matcherContractInstance.methods
      .buyKSM(evmCollectionInstance.options.address, tokenId, ethAccount, ethAccount)
      .encodeABI();

    const tx = this.uniqApi.tx.evm.call(
      ethAccount,
      this.contractAddress,
      abi,
      0,
      this.defaultGasAmount,
      await this.web3Instance.eth.getGasPrice(),
      null,
      null,
      [],
    );

    const signedTx = await options.sign(tx);

    if (!signedTx) throw new Error('Transaction cancelled');

    await signedTx.send();
    await this.repeatCheckForTransactionFinish(async () => {
      return (
        (await this.nftController?.getToken(Number(collectionId), Number(tokenId)))?.owner
          ?.Ethereum === ethAccount
      );
    });
  }

  // #endregion buy

  // #region delist
  public async cancelSell(
    account: string,
    collectionId: string,
    tokenId: string,
    options: TransactionOptions,
  ): Promise<void> {
    const ethAddress = getEthAccount(account);
    const matcherContractInstance = this.getMatcherContractInstance(ethAddress);
    const evmCollectionInstance = this.getEvmCollectionInstance(collectionId);

    const { flagActive }: TokenAskType = await matcherContractInstance.methods
      .getOrder(this.collectionIdToAddress(parseInt(collectionId, 10)), tokenId)
      .call();

    if (flagActive === '0') return;

    const abi = matcherContractInstance.methods
      .cancelAsk(evmCollectionInstance.options.address, tokenId)
      .encodeABI();

    const tx = this.uniqApi.tx.evm.call(
      getEthAccount(account),
      this.contractAddress,
      abi,
      0,
      this.defaultGasAmount,
      await this.web3Instance.eth.getGasPrice(),
      null,
      null,
      [],
    );
    const signedTx = await options.sign(tx);

    if (!signedTx) throw new Error('Transaction cancelled');

    try {
      await signedTx.send();

      await this.repeatCheckForTransactionFinish(async () => {
        const { flagActive }: TokenAskType = await matcherContractInstance.methods
          .getOrder(this.collectionIdToAddress(parseInt(collectionId, 10)), tokenId)
          .call();

        return flagActive !== '0';
      });
      return;
    } catch (e) {
      console.error('lockNftForSale error pushed upper');
      throw e;
    }
  }

  public async unlockNft(
    account: string,
    collectionId: string,
    tokenId: string,
    options: TransactionOptions,
  ) {
    const ethAccount = {
      Ethereum: getEthAccount(account),
    };
    // check if already on substrar
    const token = await this.nftController?.getToken(
      Number(collectionId),
      Number(tokenId),
    );
    if (!token) throw new Error('Token for unlock not found');
    const { owner } = token;

    if (compareEncodedAddresses(owner.Substrate, account)) return;

    const tx = this.uniqApi.tx.unique.transferFrom(
      normalizeAccountId(ethAccount),
      normalizeAccountId(account),
      collectionId,
      tokenId,
      1,
    );
    const signedTx = await options.sign(tx);

    if (!signedTx) throw new Error('Transaction cancelled');

    try {
      await signedTx.send();

      await this.repeatCheckForTransactionFinish(async () => {
        const updatedToken = await this.nftController?.getToken(
          Number(collectionId),
          Number(tokenId),
        );
        const owner = updatedToken.owner;
        if (compareEncodedAddresses(owner.Substrate, account)) return true;
        return false;
      });
      return;
    } catch (e) {
      console.error('unlockNft error pushed upper');
      throw e;
    }
  }
  // #endregion delist

  // #region transfer
  public async transferToken(
    from: string,
    to: string,
    collectionId: string,
    tokenId: string,
    options: TransactionOptions,
  ): Promise<void> {
    const tokenPart = 1;
    const recipient = { Substrate: to, Ethereum: getEthAccount(to) };
    const ethTo = getEthAccount(to);
    const token = await this.nftController?.getToken(
      Number(collectionId),
      Number(tokenId),
    );
    if (!token) throw new Error('Token not found');
    const tokenOwner = token.owner;
    let tx = this.uniqApi.tx.unique.transfer(recipient, collectionId, tokenId, tokenPart);
    if (!isTokenOwner(from, tokenOwner)) {
      const ethFrom = getEthAccount(from);
      if (tokenOwner?.Ethereum === ethFrom) {
        tx = this.uniqApi.tx.unique.transferFrom(
          normalizeAccountId({ Ethereum: ethFrom } as CrossAccountId),
          normalizeAccountId(recipient as CrossAccountId),
          collectionId,
          tokenId,
          1,
        );
      }
    }

    const signedTx = await options.sign(tx);

    if (!signedTx) throw new Error('Transaction cancelled');

    if (options.send) {
      await options.send(signedTx);
    } else {
      await signedTx.send();
    }
    await this.repeatCheckForTransactionFinish(async () => {
      const updatedToken = await this.nftController?.getToken(
        Number(collectionId),
        Number(tokenId),
      );
      const owner = updatedToken.owner;
      if (owner.Ethereum && owner.Ethereum === ethTo) return true;
      if (owner.Substrate && compareEncodedAddresses(owner.Substrate, to)) return true;
      return false;
    });
  }

  public async transferToAuction(
    owner: string,
    collectionId: string,
    tokenId: string,
    options: TransactionOptions,
  ) {
    return this.transferToken(owner, this.auctionAddress, collectionId, tokenId, options);
  }

  private fromStringToBnString(value: string, decimals: number): string {
    if (!value || !value.length) {
      return '0';
    }

    const numStringValue = value.replace(',', '.');
    const [left, right] = numStringValue.split('.');
    const decimalsFromLessZeroString = right?.length || 0;
    const bigValue = [...(left || []), ...(right || [])].join('').replace(/^0+/, '');
    return (
      Number(bigValue) * Math.pow(10, decimals - decimalsFromLessZeroString)
    ).toString();
  }

  public async transferBidBalance(
    from: string,
    amount: string,
    options: TransactionOptions,
  ): Promise<void> {
    const tx = this.kusamaApi.tx.balances.transferKeepAlive(
      encodeAddress(this.auctionAddress),
      this.fromStringToBnString(amount, this.kusamaDecimals),
    );
    const signedTx = await options.sign(tx);
    if (!signedTx) throw new Error('Transaction cancelled');
    if (options.send) {
      await options.send(signedTx);
    } else {
      await signedTx.send();
    }
    await sleep(1000);
    // TODO: any way to check this being executed?
  }

  public async transferBalance(
    from: string,
    to: string,
    amount: string,
    options: TransactionOptions,
  ): Promise<void> {
    const tx = this.kusamaApi.tx.balances.transferKeepAlive(
      encodeAddress(to),
      this.fromStringToBnString(amount, this.kusamaDecimals),
    );
    const signedTx = await options.sign(tx);
    if (!signedTx) throw new Error('Transaction cancelled');
    if (options.send) {
      await options.send(signedTx);
    } else {
      await signedTx.send();
    }
    await sleep(1000);
    // TODO: any way to check this being executed?
  }
  // #endregion transfer
}

export default MinterController;
