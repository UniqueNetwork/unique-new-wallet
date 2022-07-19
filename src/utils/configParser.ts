import { Chain } from '@app/types';

const configKeyRegexp = /NET_(?<network>[A-Z]+)_NAME$/gm;

export const defaultChainKey = 'new-wallet_chain';

const findNetworkParamByName = (
  config: Record<string, string | undefined>,
  network: string,
  name: string,
) => {
  const envKey = Object.keys(config).find((key) =>
    key.includes(`NET_${network}_${name}`),
  );

  if (!envKey) {
    return '';
  }

  try {
    return JSON.parse(config[envKey] || '');
  } catch {
    return config[envKey] || '';
  }
};

export const getNetworkList = (config: Record<string, string | undefined>): string[] => {
  return Object.keys(config).reduce<string[]>((acc, key) => {
    if (!key.includes('NET_') || key.includes('NET_DEFAULT')) {
      return acc;
    }

    const { network } = configKeyRegexp.exec(key)?.groups || {};

    if (network) {
      acc.push(network);
    }

    return acc;
  }, []);
};

export const getDefaultChain = (config: Record<string, string | undefined>) => {
  const storedChain = localStorage.getItem(defaultChainKey);
  const networkList = getNetworkList(config);

  // make sure that we are trying to use an config-existing chain, otherwise go with default one
  if (storedChain) {
    const isExist = !!networkList.find((network) => network === storedChain);

    if (isExist) {
      return storedChain;
    }
  }

  const newChain = config.REACT_APP_NET_DEFAULT || getNetworkList(config)[0];

  localStorage.setItem(defaultChainKey, newChain);

  return newChain;
};

export const getNetworkParams = (
  config: Record<string, string | undefined>,
  network: string,
): Chain => {
  return {
    gqlEndpoint: findNetworkParamByName(config, network, 'GQL'),
    name: findNetworkParamByName(config, network, 'NAME'),
    apiEndpoint: findNetworkParamByName(config, network, 'API'),
    mintingEnabled: findNetworkParamByName(config, network, 'MINTING_ENABLED'),
    transfersEnabled: findNetworkParamByName(config, network, 'TRANSFERS_ENABLED'),
    burnEnabled: findNetworkParamByName(config, network, 'BURN_ENABLED'),
    switchingEnabled: findNetworkParamByName(config, network, 'SWITCHING_ENABLED'),
    network,
    subscanAddress: findNetworkParamByName(config, network, 'SUBSCAN_ADDRESS'),
    uniquescanAddress: findNetworkParamByName(config, network, 'UNIQUESCAN_ADDRESS'),
  };
};

export const getChainList = (
  config: Record<string, string | undefined>,
): Record<string, Chain> => {
  return getNetworkList(config).reduce<Record<string, Chain>>((acc, network) => {
    console.log(network);
    const { apiEndpoint, gqlEndpoint, ...params } = getNetworkParams(config, network);

    if (apiEndpoint) {
      acc[network] = {
        apiEndpoint,
        gqlEndpoint,
        ...params,
      };
    }

    return acc;
  }, {});
};
