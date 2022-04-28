import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const getApolloClient = (clientEndpoint: string) =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: clientEndpoint }),
  });
