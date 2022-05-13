import { Context, Consumer, Provider, createContext } from 'react';

import { Chain } from '@app/types';

export type ApiContextProps = {
  defaultChain: Chain;
};

const ApiContext: Context<ApiContextProps> = createContext(
  {} as unknown as ApiContextProps,
);
const ApiConsumer: Consumer<ApiContextProps> = ApiContext.Consumer;
const ApiProvider: Provider<ApiContextProps> = ApiContext.Provider;

export default ApiContext;

export { ApiConsumer, ApiProvider };
