import { Consumer, Context, createContext, Provider } from 'react';

import { ChainProperties } from '@app/types/Api';

export type ChainPropertiesContextProps = {
  chainProperties?: ChainProperties;
  isLoading: boolean;
};

export const ChainPropertiesContext: Context<ChainPropertiesContextProps> = createContext(
  {} as unknown as ChainPropertiesContextProps,
);
export const ChainPropertiesConsumer: Consumer<ChainPropertiesContextProps> =
  ChainPropertiesContext.Consumer;
export const ChainPropertiesProvider: Provider<ChainPropertiesContextProps> =
  ChainPropertiesContext.Provider;
