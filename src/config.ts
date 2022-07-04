declare type Env = {
  IPFS_GATEWAY_URL: string | undefined;
  IMAGE_SERVER_URL: string | undefined;
  SCAN_ACCOUNT_URL: string | undefined;
  NET_QUARTZ_REST_API_URL: string | undefined;
  HASURA_API_URL: string | undefined;
} & Record<string, string | undefined>;

declare type Config = {
  IPFSGateway: string | undefined;
  imageServerUrl: string | undefined;
  scanUrl: string | undefined;
  quartzRestApiUrl: string | undefined;
  hasuraApiUrl: string | undefined;
};

declare global {
  interface Window {
    ENV: Env;
  }
}

const config: Config = {
  // defaultChain: '',
  IPFSGateway: window.ENV?.IPFS_GATEWAY_URL || process.env.REACT_APP_IPFS_GATEWAY_URL,
  imageServerUrl: window.ENV?.IMAGE_SERVER_URL || process.env.REACT_APP_IMAGE_SERVER_URL,
  scanUrl: window.ENV?.SCAN_ACCOUNT_URL || process.env.REACT_APP_SCAN_ACCOUNT_URL,
  quartzRestApiUrl:
    window.ENV?.NET_QUARTZ_REST_API_URL || process.env.REACT_APP_NET_QUARTZ_REST_API_URL,
  hasuraApiUrl: window.ENV?.HASURA_API_URL || process.env.REACT_APP_HASURA_API_URL,
};

export default config;
