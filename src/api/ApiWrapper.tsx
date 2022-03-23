import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IGqlClient } from './graphQL/gqlClient';
import { IRpcClient } from './chainApi/types';
import { ApiContextProps, ApiProvider, ChainData } from './ApiContext';
import config from '../config';
import { defaultChainKey } from '../utils/configParser';
import { gqlClient as gql, rpcClient as rpc } from '.';
import { getSettings } from './restApi/settings/settings';
import { ApolloProvider } from '@apollo/client';
import AuctionSocketProvider from './restApi/auction/AuctionSocketProvider';

interface ChainProviderProps {
  children: React.ReactNode;
  gqlClient?: IGqlClient;
  rpcClient?: IRpcClient;
}

const { chains, defaultChain } = config;

const ApiWrapper = ({
  children,
  gqlClient = gql,
  rpcClient = rpc
}: ChainProviderProps) => {
  const [chainData, setChainData] = useState<ChainData>();
  const [isRpcClientInitialized, setRpcClientInitialized] =
    useState<boolean>(false);
  const { chainId } = useParams<'chainId'>();

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
            minter: rpcClient.minterController
          }) ||
        undefined,
      chainData,
      currentChain: chainId ? chains[chainId] : defaultChain,
      rawRpcApi: rpcClient.rawUniqRpcApi,
      rpcClient
    };
  }, [isRpcClientInitialized, chainId, chainData]);

  return (
    <ApiProvider value={value}>
      <AuctionSocketProvider url={config.uniqueApiUrl}>
        <ApolloProvider client={gqlClient.client}>{children}</ApolloProvider>
      </AuctionSocketProvider>
    </ApiProvider>
  );
};

export default ApiWrapper;
