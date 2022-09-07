import { INetwork } from '@unique-nft/ui-kit';

import { config } from '@app/config';

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
