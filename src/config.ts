import { Chain } from './api/chainApi/types';
import { getChainList, getDefaultChain } from './utils/configParser';

declare type Env = {
  REACT_APP_UNIQUE_COLLECTION_IDS: string | undefined;
  REACT_APP_IPFS_GATEWAY: string | undefined;
  REACT_APP_UNIQUE_API_URL: string | undefined;
  REACT_APP_SCAN_ACCOUNT_URL: string | undefined;
} & Record<string, string | undefined>;

declare type Config = {
  feturedCollectionIds: number[];
  uniqueApiUrl: string | undefined;
  scanUrl: string | undefined;
  IPFSGateway: string | undefined;
  chains: Record<string, Chain>;
  defaultChain: Chain;
};

declare global {
  interface Window {
    ENV: Env;
  }
}

const chains = getChainList(window.ENV || process.env);

const config: Config = {
  feturedCollectionIds:
    (window.ENV?.UNIQUE_COLLECTION_IDS || process.env.REACT_APP_UNIQUE_COLLECTION_IDS)
      ?.split(',')
      .map(Number) || [],
  uniqueApiUrl: window.ENV?.UNIQUE_API_URL || process.env.REACT_APP_UNIQUE_API_URL,
  IPFSGateway: window.ENV?.IPFS_GATEWAY || process.env.REACT_APP_IPFS_GATEWAY,
  scanUrl: window.ENV?.SCAN_ACCOUNT_URL || process.env.REACT_APP_SCAN_ACCOUNT_URL,
  chains,
  defaultChain: chains[getDefaultChain(window.ENV || process.env)],
};

export default config;
