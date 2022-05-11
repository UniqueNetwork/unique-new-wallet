import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';

import { defaultChainKey } from '@app/utils';

import { GqlClient } from './graphQL/gqlClient';
import RpcClient from './chainApi/rpcClient';
import { ApiContextProps, ApiProvider, ChainData } from './ApiContext';
import config from '../config';
import { getSettings } from './restApi/settings/settings';

const gqlClient = new GqlClient('');
const rpcClient = new RpcClient();

interface ChainProviderProps {
  children: React.ReactNode;
}

const { chains, defaultChain } = config;
export type ChainProperties = { ss58Format: string };

export const ApiWrapper = ({ children }: ChainProviderProps) => {
  const [chainData, setChainData] = useState<ChainData>();
  const [chainProperties, setChainProperties] = useState<ChainProperties>();
  const [isRpcClientInitialized, setRpcClientInitialized] = useState<boolean>(false);
  const { chainId } = useParams<'chainId'>();

  const chainAddressFormat = useCallback(
    (address: string): string | undefined => {
      try {
        if (chainProperties?.ss58Format) {
          return encodeAddress(
            decodeAddress(address),
            parseInt(chainProperties?.ss58Format),
          );
        }
      } catch (e) {
        console.log('chainAddressFormat error', e);

        return address;
      }

      return '';
    },
    [chainProperties],
  );

  useEffect(() => {
    (async () => {
      const { data: settings } = await getSettings();

      rpcClient?.setOnChainReadyListener(setChainData);
      await rpcClient?.initialize(settings);

      setRpcClientInitialized(true);
      setChainData(rpcClient?.chainData);
    })()
      .then(() => console.log('Rpc connectection: success'))
      .catch((e) => console.log('Rpc connectection: failed', e));
  }, []);

  // update endpoint if chainId is changed
  useEffect(() => {
    if (Object.values(chains).length === 0) {
      throw new Error('Networks is not configured');
    }

    if (chainId) {
      localStorage.setItem(defaultChainKey, chainId);
    }
  }, [chainId]);

  // get context value for ApiContext
  const value = useMemo<ApiContextProps>(() => {
    return {
      api:
        (rpcClient &&
          isRpcClientInitialized && {
            collection: rpcClient.collectionController,
            nft: rpcClient.nftController,
            minter: rpcClient.minterController,
          }) ||
        undefined,
      chainAddressFormat,
      chainData,
      currentChain: chainId ? chains[chainId] : defaultChain,
      rawRpcApi: rpcClient.rawUniqRpcApi,
      rpcClient,
    };
  }, [isRpcClientInitialized, chainAddressFormat, chainData, chainId]);

  return (
    <ApiProvider value={value}>
      <ApolloProvider client={gqlClient.client}>{children}</ApolloProvider>
    </ApiProvider>
  );
};
