import { Chain } from '@app/types';

import { getChainList, getDefaultChain } from './utils/configParser';

declare type Env = {
  REACT_APP_UNIQUE_COLLECTION_IDS: string | undefined;
  REACT_APP_IPFS_GATEWAY: string | undefined;
  REACT_APP_UNIQUE_API_URL: string | undefined;
  REACT_APP_SCAN_ACCOUNT_URL: string | undefined;
  REACT_APP_HASURA_API_URL: string | undefined;
} & Record<string, string | undefined>;

declare type Config = {
  uniqueApiUrl: string | undefined;
  uniqueRestApiUrl: string | undefined;
  scanUrl: string | undefined;
  IPFSGateway: string | undefined;
  hasuraApiUrl: string | undefined;
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
  uniqueApiUrl: window.ENV?.UNIQUE_API_URL || process.env.REACT_APP_UNIQUE_API_URL,
  uniqueRestApiUrl: window.ENV?.REST_API_URL || process.env.REACT_APP_REST_API_URL,
  IPFSGateway: window.ENV?.IPFS_GATEWAY || process.env.REACT_APP_IPFS_GATEWAY,
  scanUrl: window.ENV?.SCAN_ACCOUNT_URL || process.env.REACT_APP_SCAN_ACCOUNT_URL,
  chains,
  defaultChain: chains[getDefaultChain(window.ENV || process.env)],
  hasuraApiUrl: window.ENV?.HASURA_API_URL || process.env.REACT_APP_HASURA_API_URL,
};

export default config;
