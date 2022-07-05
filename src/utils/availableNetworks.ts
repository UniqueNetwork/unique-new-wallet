import config from '@app/config';
import { Chain, NetworkType } from '@app/types';

export const networksUrls: Record<NetworkType, string | undefined> = {
  QTZ: config.quartzRestApiUrl,
  OPL: '',
  KSM: '',
  UNQ: '',
};

export const networks: Chain[] = [
  {
    apiEndpoint: networksUrls.QTZ || '',
    id: 'quartz',
    name: 'Quartz',
    icon: {
      name: 'chain-quartz',
      size: 40,
    },
  },
];
