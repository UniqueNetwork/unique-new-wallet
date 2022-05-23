import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { offsetLimitPagination } from '@apollo/client/utilities';

export const getApolloClient = (clientEndpoint: string) =>
  new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            view_tokens: {
              ...offsetLimitPagination(),
              read: (existing: any, { args }: any) =>
                existing && existing.slice(args.offset, args.offset + args.limit),
            },
          },
        },
      },
    }),
    link: new HttpLink({ uri: clientEndpoint }),
  });
