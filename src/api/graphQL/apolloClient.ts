import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export const getApolloClient = (clientEndpoint: string) =>
  new ApolloClient({
<<<<<<< HEAD
    cache: new InMemoryCache({}),
=======
    cache: new InMemoryCache({
      typePolicies: {
        view_collections: {
          keyFields: ['collection_id'],
        },
      },
    }),
>>>>>>> origin/develop
    link: new HttpLink({ uri: clientEndpoint }),
  });
