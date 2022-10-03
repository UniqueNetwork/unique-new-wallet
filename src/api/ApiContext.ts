import { Context, Consumer, Provider, createContext } from 'react';
import { IClient } from '@unique-nft/sdk';

import { Chain } from '@app/types';

export type ApiContextProps = {
  api: IClient;
  currentChain: Chain;
  setCurrentChain: (chain: Chain) => void;
};

const ApiContext: Context<ApiContextProps> = createContext(
  {} as unknown as ApiContextProps,
);
const ApiConsumer: Consumer<ApiContextProps> = ApiContext.Consumer;
const ApiProvider: Provider<ApiContextProps> = ApiContext.Provider;

export default ApiContext;

export { ApiConsumer, ApiProvider };
