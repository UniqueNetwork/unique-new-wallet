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
  const networkValues = Object.entries(config);

  return Object.keys(config).reduce<string[]>((acc, key) => {
    if (!key.includes('NET_') || key.includes('NET_DEFAULT')) {
      return acc;
    }

    const { network } = configKeyRegexp.exec(key)?.groups || {};

    const isSwitchingNetwork = network
      ? networkValues.find(
          ([name, value]) =>
            name.includes(`${network}_SWITCHING_ENABLED`) && value === 'true',
        )
      : undefined;

    if (network && isSwitchingNetwork?.length) {
      acc.push(network);
    }

    return acc;
  }, []);
};

export const getDefaultChain = (config: Record<string, string | undefined>) => {
  const storedChain = localStorage.getItem(defaultChainKey);
  const networkList = getNetworkList(config);

  if (networkList.length === 0) {
    throw new Error('No active networks specified');
  }

  // make sure that we are trying to use an config-existing chain, otherwise go with default one
  if (storedChain) {
    const isExist = !!networkList.find((network) => network === storedChain);

    if (isExist) {
      return storedChain;
    }
  }

  let chain = getNetworkList(config)[0];

  const defaultNetwork = config.NET_DEFAULT || config.REACT_APP_NET_DEFAULT;

  if (defaultNetwork) {
    const isExist = !!networkList.find((network) => network === defaultNetwork);
    if (isExist) {
      chain = defaultNetwork;
    }
  }

  localStorage.setItem(defaultChainKey, chain);

  return chain;
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
