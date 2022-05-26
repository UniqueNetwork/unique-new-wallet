import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import { Chain } from '@app/types';

import { GqlClient } from './graphQL/gqlClient';
import { ApiContextProps, ApiProvider } from './ApiContext';
import config from '../config';

const gqlClient = new GqlClient(config.hasuraApiUrl || '');

interface ChainProviderProps {
  children: React.ReactNode;
}

const { chains, defaultChain } = config;

export const ApiWrapper = ({ children }: ChainProviderProps) => {
  const { chainId } = useParams<'chainId'>();
  const [currentChain, setCurrentChain] = useState<Chain>();

  // update endpoint if chainId is changed
  useEffect(() => {
    if (Object.values(chains).length === 0) {
      throw new Error('Networks is not configured');
    }
  }, [chainId]);

  // get context value for ApiContext
  const value = useMemo<ApiContextProps>(() => {
    return {
      currentChain,
      defaultChain,
    };
  }, [currentChain]);

  return (
    <ApiProvider value={value}>
      <ApolloProvider client={gqlClient.client}>{children}</ApolloProvider>
    </ApiProvider>
  );
};
