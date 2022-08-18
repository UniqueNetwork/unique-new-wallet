import React, { useEffect, useMemo, useState } from 'react';
import { ApolloProvider } from '@apollo/client';

import { Chain } from '@app/types';
import { BaseApi, IBaseApi } from '@app/api';
import { defaultChainKey } from '@app/utils/configParser';

import { GqlClient } from './graphQL/gqlClient';
import { ApiContextProps, ApiProvider } from './ApiContext';
import { config } from '../config';

interface ChainProviderProps {
  children: React.ReactNode;
}

export const ApiWrapper = ({ children }: ChainProviderProps) => {
  const [currentChain, setCurrentChain] = useState<Chain>(() => {
    const network = window.location.pathname.split('/')[1];
    const chain = network ? config.chains[network.toUpperCase()] : null;
    return chain || config.defaultChain;
  });
  const [apiInstance, setApiInstance] = useState<IBaseApi>();
  const [gqlClient, setGqlClient] = useState<GqlClient>(
    () => new GqlClient(currentChain.gqlEndpoint),
  );

  const value = useMemo<ApiContextProps>(
    () => ({
      api: apiInstance,
      currentChain,
      setCurrentChain,
    }),
    [apiInstance, currentChain],
  );

  useEffect(() => {
    if (!currentChain) {
      return;
    }
    localStorage.setItem(defaultChainKey, currentChain.network);
    setApiInstance(new BaseApi(currentChain.apiEndpoint));
    setGqlClient(new GqlClient(currentChain.gqlEndpoint));
  }, [currentChain]);

  return (
    <ApiProvider value={value}>
      <ApolloProvider client={gqlClient.client}>{children}</ApolloProvider>
    </ApiProvider>
  );
};
