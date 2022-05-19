import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

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
