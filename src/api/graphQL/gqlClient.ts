import { ApolloClient, HttpLink, NormalizedCacheObject } from '@apollo/client';

import { getApolloClient } from './apolloClient';

export interface IGqlClient {
  client: ApolloClient<NormalizedCacheObject>;
  changeEndpoint(endpoint: string): void;
}

export class GqlClient implements IGqlClient {
  public client: ApolloClient<NormalizedCacheObject>;

  constructor(gqlEndpoint: string) {
    this.client = getApolloClient(gqlEndpoint);
  }

  public changeEndpoint(gqlEndpoint: string) {
    this.client.stop(); // terminate all active query processes
    this.client.clearStore().then(() => {
      // resets the entire store by clearing out the cache
      this.client.setLink(new HttpLink({ uri: gqlEndpoint }));
    });
  }

  public clearCache() {
    this.client.stop(); // terminate all active query processes
    this.client.clearStore();
  }
}
