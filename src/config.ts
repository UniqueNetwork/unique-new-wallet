import { Chain } from '@app/types';

import { getChainList, getDefaultChain } from './utils/configParser';

declare type Env = {
  NET_DEFAULT: string | undefined;
  IPFS_GATEWAY: string | undefined;
  SUBSCAN_URL: string | undefined;
  UNIQUESCAN_URL: string | undefined;
  NET_QUARTZ_SUBSCAN_ACCOUNT_URL: string | undefined;
  NET_UNIQUE_SUBSCAN_ACCOUNT_URL: string | undefined;
} & Record<string, string | undefined>;

declare type Config = {
  IPFSGateway: string | undefined;
  chains: Record<string, Chain>;
  defaultChain: Chain;
  quartzSubscanUrl: string | undefined;
  uniqueSubscanUrl: string | undefined;
  uniqueScanUrl: string | undefined;
};

declare global {
  interface Window {
    ENV: Env;
  }
}

const chains = getChainList(window.ENV || process.env);

export const config: Config = {
  IPFSGateway: window.ENV?.IPFS_GATEWAY_URL || process.env.REACT_APP_IPFS_GATEWAY_URL,
  chains,
  defaultChain: chains[getDefaultChain(window.ENV || process.env)],
  quartzSubscanUrl:
    window.ENV?.NET_QUARTZ_SUBSCAN_ACCOUNT_URL ||
    process.env.REACT_APP_NET_QUARTZ_SUBSCAN_ACCOUNT_URL,
  uniqueSubscanUrl:
    window.ENV?.NET_UNIQUE_SUBSCAN_ACCOUNT_URL ||
    process.env.REACT_APP_NET_UNIQUE_SUBSCAN_ACCOUNT_URL,
  uniqueScanUrl: window.ENV?.UNIQUESCAN_URL || process.env.REACT_APP_UNIQUESCAN_URL,
};

console.log(config);
