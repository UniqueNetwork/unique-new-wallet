import { Chain } from '@app/types';

import { getChainList, getDefaultChain } from './utils/configParser';

declare type Env = {
  NET_DEFAULT: string | undefined;
  IPFS_GATEWAY: string | undefined;
  SCAN_ACCOUNT_URL: string | undefined;
} & Record<string, string | undefined>;

declare type Config = {
  IPFSGateway: string | undefined;
  scanUrl: string | undefined;
  chains: Record<string, Chain>;
  defaultChain: Chain;
};

declare global {
  interface Window {
    ENV: Env;
  }
}

const chains = getChainList(window.ENV || process.env);

export const config: Config = {
  IPFSGateway: window.ENV?.IPFS_GATEWAY || process.env.REACT_APP_IPFS_GATEWAY_URL,
  scanUrl: window.ENV?.SCAN_ACCOUNT_URL || process.env.REACT_APP_SCAN_ACCOUNT_URL,
  chains,
  defaultChain: chains[getDefaultChain(window.ENV || process.env)],
};

console.log(config);
