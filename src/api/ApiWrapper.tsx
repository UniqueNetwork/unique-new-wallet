import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ApolloProvider } from '@apollo/client';

import { Chain } from '@app/types';
import { BaseApi, IBaseApi } from '@app/api';
import { networks } from '@app/utils';

import { GqlClient } from './graphQL/gqlClient';
import { ApiContextProps, ApiProvider } from './ApiContext';
import config from '../config';

const gqlClient = new GqlClient(config.hasuraApiUrl || '');

interface ChainProviderProps {
  children: React.ReactNode;
}

export const ApiWrapper = ({ children }: ChainProviderProps) => {
  const [apiInstance, setApiInstance] = useState<IBaseApi>();
  const [currentChain, setCurrentChain] = useState<Chain>();

  const selectDefaultNetwork = useCallback(() => {
    setCurrentChain(networks[0]);
  }, []);

  // get context value for ApiContext
  const value = useMemo<ApiContextProps>(
    () => ({
      api: apiInstance,
      currentChain,
      setCurrentChain,
    }),
    [apiInstance, currentChain],
  );

  useEffect(() => {
    if (currentChain) {
      setApiInstance(new BaseApi(currentChain?.apiEndpoint));
    }
  }, [currentChain]);

  useEffect(() => {
    void selectDefaultNetwork();
  }, [selectDefaultNetwork]);

  return (
    <ApiProvider value={value}>
      <ApolloProvider client={gqlClient.client}>{children}</ApolloProvider>
    </ApiProvider>
  );
};
