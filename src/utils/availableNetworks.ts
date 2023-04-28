import { config } from '@app/config';
import { INetwork } from '@app/types';

const NETWORKS_ORDER: Record<string, number> = {
  UNIQUE: 1,
  QUARTZ: 1,
  OPAL: 2,
};

export const networks: INetwork[] = Object.values(config.activeChains)
  .map(({ name, network }) => ({
    icon: {
      name: `chain-${network.toLowerCase()}`,
      size: 16,
    },
    id: network,
    name,
  }))
  .sort((item1, item2) => {
    return NETWORKS_ORDER[item1.id] > NETWORKS_ORDER[item2.id] ? 1 : -1;
  });
