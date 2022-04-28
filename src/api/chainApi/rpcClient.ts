import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatBalance } from '@polkadot/util';
import { typesChain } from '@phala/typedefs';
import { TypeRegistry } from '@polkadot/types/create';

import {
  IRpcClient,
  INFTController,
  IRpcClientOptions,
  ICollectionController,
  IMinterController,
  IRpcConfig,
} from './types';
import { typesBundle } from './unique/bundledTypesDefinitions';
import rpcMethods from './unique/rpcMethods';
import UniqueNFTController from './unique/NFTController';
import UniqueCollectionController from './unique/collectionController';
import MinterKusamaController from './unique/minterController';
import { ChainData } from '../ApiContext';
import CrustMaxwell from './unique/crust-maxwell';

export class RpcClient implements IRpcClient {
  public nftController?: INFTController<any, any>;
  public collectionController?: ICollectionController<any, any>;
  public minterController?: IMinterController;
  public rawUniqRpcApi?: ApiPromise;
  public rawKusamaRpcApi?: ApiPromise;
  public isKusamaApiInitialized = false;
  public isKusamaApiConnected = false;
  public isApiConnected = false;
  public isApiInitialized = false;
  public apiConnectionError?: string;
  public chainData: any = undefined;
  public rpcEndpoint = '';
  private options: IRpcClientOptions = {};
  private config?: IRpcConfig;

  async initialize(config: IRpcConfig, options?: IRpcClientOptions) {
    this.rpcEndpoint = config.blockchain.unique.wsEndpoint || '';
    this.options = options || {};
    this.config = config || {};
    this.rawKusamaRpcApi = await this.initKusamaApi(
      config.blockchain.kusama.wsEndpoint || '',
    );
    await this.setApi();
  }

  private async initKusamaApi(wsEndpoint: string) {
    const provider = new WsProvider(wsEndpoint);

    //    const types = this.getDevTypes();

    const kusamaRegistry = new TypeRegistry();

    const kusamaApi = new ApiPromise({
      provider,
      registry: kusamaRegistry,
      typesBundle,
      typesChain: {
        ...typesChain,
        'Crust Maxwell': CrustMaxwell,
      },
    });

    kusamaApi.on('connected', () => {
      this.isApiConnected = true;
    });
    kusamaApi.on('disconnected', () => {
      this.isApiConnected = false;
    });
    kusamaApi.on('error', (error: Error) => {
      this.setApiError(error.message);
    });

    return new Promise<ApiPromise>((resolve, reject) => {
      kusamaApi.on('connected', () => {
        this.isApiConnected = true;
      });
      kusamaApi.on('disconnected', () => {
        this.isApiConnected = false;
      });
      kusamaApi.on('error', (error: Error) => {
        this.setApiError(error.message);
        reject(error);
      });

      kusamaApi.on('ready', (): void => {
        this.setIsKusamaApiConnected(true);
        console.log('Kusama is ready');
        resolve(kusamaApi);
      });
    });
  }

  private setIsKusamaApiConnected(value: boolean) {
    this.isKusamaApiConnected = value;
  }

  private setIsApiConnected(value: boolean) {
    this.isApiConnected = value;
  }

  private setApiError(message: string) {
    this.apiConnectionError = message;
  }

  private setIsApiInitialized(value: boolean) {
    this.isApiInitialized = value;
  }

  private async setApi() {
    if (this.rawUniqRpcApi) {
      this.setIsApiConnected(false);
      this.rawUniqRpcApi.disconnect(); // TODO: make async and await disconnect (same for kusama client)
    }

    const provider = new WsProvider(this.rpcEndpoint);

    const _api = new ApiPromise({
      provider,
      rpc: {
        unique: rpcMethods,
      },
      // @ts-ignore
      typesBundle,
    });
    this.rawUniqRpcApi = _api;
    this.nftController = new UniqueNFTController(_api, {
      collectionsIds: this.config?.blockchain.unique.collectionIds || [],
    });
    this.collectionController = new UniqueCollectionController(
      _api,
      this.config?.blockchain.unique.collectionIds || [],
    );
    if (!this.rawKusamaRpcApi) throw new Error('Kusama API is not initialized');
    this.minterController = new MinterKusamaController(_api, this.rawKusamaRpcApi, {
      contractAddress: this.config?.blockchain.unique.contractAddress,
      escrowAddress: this.config?.blockchain.escrowAddress,
      uniqueSubstrateApiRpc: this.config?.blockchain.unique.wsEndpoint,
      auctionAddress: this.config?.auction.address,
      nftController: this.nftController,
    });

    return new Promise<void>((resolve, reject) => {
      _api.on('connected', () => this.setIsApiConnected(true));
      _api.on('disconnected', () => this.setIsApiConnected(false));
      _api.on('error', (error: Error) => {
        this.setApiError(error.message);
        reject(error);
      });

      _api.on('ready', async () => {
        this.setIsApiConnected(true);
        await this.getChainData();
        if (this.options.onChainReady) this.options.onChainReady(this.chainData);
        this.setIsApiInitialized(true);
        resolve();
      });
    });
  }

  private async getChainData() {
    if (!this.rawUniqRpcApi)
      throw new Error("Attempted to get chain data while api isn't initialized");
    const [chainProperties, systemChain, systemName] = await Promise.all([
      this.rawUniqRpcApi.rpc.system.properties(),
      this.rawUniqRpcApi.rpc.system.chain(),
      this.rawUniqRpcApi.rpc.system.name(),
    ]);

    this.chainData = {
      properties: {
        tokenSymbol: chainProperties.tokenSymbol
          .unwrapOr([formatBalance.getDefaults().unit])[0]
          .toString(),
      },
      systemChain: (systemChain || '<unknown>').toString(),
      systemName: systemName.toString(),
    };
  }

  public setOnChainReadyListener(callback: (chainData: ChainData) => void) {
    this.options.onChainReady = callback;
  }

  public changeEndpoint(rpcEndpoint: string, options?: IRpcClientOptions) {
    this.rpcEndpoint = rpcEndpoint;
    this.options.onChainReady = options?.onChainReady;
    this.setApi();
  }
}

export default RpcClient;
