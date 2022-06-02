import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const getApolloClient = (clientEndpoint: string) =>
  new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        view_collections: {
          keyFields: ['collection_id'],
        },
      },
    }),
    link: new HttpLink({ uri: clientEndpoint }),
  });
