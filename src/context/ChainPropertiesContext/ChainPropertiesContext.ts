import { Context, createContext } from 'react';

import { ChainPropertiesResponse } from '@app/types/Api';

export type ChainPropertiesContextProps = {
  chainProperties: ChainPropertiesResponse;
};

export const ChainPropertiesContext: Context<ChainPropertiesContextProps> = createContext(
  {} as unknown as ChainPropertiesContextProps,
);
