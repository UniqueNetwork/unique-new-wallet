import { config } from '@app/config';
import { INetwork } from '@app/types';

export const networks: INetwork[] = Object.values(config.activeChains).map(
  ({ name, network }) => ({
    icon: {
      name: `chain-${network.toLowerCase()}`,
      size: 16,
    },
    id: network,
    name,
  }),
);
