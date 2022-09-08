import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import keyring from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { ApiWrapper, BaseApi } from '@app/api';
import { ChainPropertiesWrapper } from '@app/context';
import { config } from '@app/config';
import { ChainPropertiesResponse } from '@app/types/Api';

import AppRoutes from './AppRoutes';
import { GlobalStyle } from './styles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const http = new BaseApi(config.defaultChain.apiEndpoint);

http
  .get<ChainPropertiesResponse>('/chain/properties')
  .then((properties) => {
    cryptoWaitReady().then(() => {
      keyring.loadAll({
        ss58Format: properties.SS58Prefix,
        genesisHash: properties.genesisHash,
      });

      ReactDOM.render(
        <StrictMode>
          <GlobalStyle />
          <QueryClientProvider client={queryClient}>
            <ApiWrapper>
              <ChainPropertiesWrapper initialProperties={properties}>
                <AppRoutes />
                {/*<ReactQueryDevtools />*/}
              </ChainPropertiesWrapper>
            </ApiWrapper>
          </QueryClientProvider>
        </StrictMode>,
        document.getElementById('root'),
      );
    });
  })
  .catch((e) => {
    throw new Error(e);
  });
