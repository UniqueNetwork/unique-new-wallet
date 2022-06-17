declare type Env = {
  REACT_APP_UNIQUE_COLLECTION_IDS: string | undefined;
  REACT_APP_IPFS_GATEWAY: string | undefined;
  REACT_APP_IMAGE_SERVER_URL: string | undefined;
  REACT_APP_UNIQUE_API_URL: string | undefined;
  REACT_APP_SCAN_ACCOUNT_URL: string | undefined;
  REACT_APP_HASURA_API_URL: string | undefined;
} & Record<string, string | undefined>;

declare type Config = {
  uniqueApiUrl: string | undefined;
  uniqueRestApiUrl: string | undefined;
  scanUrl: string | undefined;
  imageServerUrl: string | undefined;
  IPFSGateway: string | undefined;
  hasuraApiUrl: string | undefined;
  // chains: Record<string, Chain>;
};

declare global {
  interface Window {
    ENV: Env;
  }
}

const config: Config = {
  // defaultChain: '',
  uniqueApiUrl: window.ENV?.UNIQUE_API_URL || process.env.REACT_APP_UNIQUE_API_URL,
  uniqueRestApiUrl: window.ENV?.REST_API_URL || process.env.REACT_APP_REST_API_URL,
  imageServerUrl: window.ENV?.IMAGE_SERVER_URL || process.env.REACT_APP_IMAGE_SERVER_URL,
  IPFSGateway: window.ENV?.IPFS_GATEWAY || process.env.REACT_APP_IPFS_GATEWAY,
  scanUrl: window.ENV?.SCAN_ACCOUNT_URL || process.env.REACT_APP_SCAN_ACCOUNT_URL,
  hasuraApiUrl: window.ENV?.HASURA_API_URL || process.env.REACT_APP_HASURA_API_URL,
};

export default config;
