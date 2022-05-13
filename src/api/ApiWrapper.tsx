import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import { GqlClient } from './graphQL/gqlClient';
import { ApiContextProps, ApiProvider } from './ApiContext';
import config from '../config';

const gqlClient = new GqlClient('');

interface ChainProviderProps {
  children: React.ReactNode;
}

const { chains, defaultChain } = config;

export const ApiWrapper = ({ children }: ChainProviderProps) => {
  const { chainId } = useParams<'chainId'>();

  // update endpoint if chainId is changed
  useEffect(() => {
    if (Object.values(chains).length === 0) {
      throw new Error('Networks is not configured');
    }
  }, [chainId]);

  // get context value for ApiContext
  const value = useMemo<ApiContextProps>(() => {
    return {
      defaultChain,
    };
  }, []);

  return (
    <ApiProvider value={value}>
      <ApolloProvider client={gqlClient.client}>{children}</ApolloProvider>
    </ApiProvider>
  );
};
