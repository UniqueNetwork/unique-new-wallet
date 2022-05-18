import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import AppRoutes from './AppRoutes';
import { GlobalStyle } from './styles';

import './styles/variables.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: process.env.NODE_ENV === 'production',
    },
  },
});

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
  document.getElementById('root'),
);
