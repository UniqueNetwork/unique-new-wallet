import config from '@app/config';
import { Chain, NetworkType } from '@app/types';

export const networksUrls: Record<NetworkType, string | undefined> = {
  QTZ: config.quartzRestApiUrl,
  OPL: '',
  KSM: '',
  UNQ: config.uniqueRestApiUrl,
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
  {
    apiEndpoint: networksUrls.OPL || '',
    id: 'opal',
    name: 'Opal',
    icon: {
      name: 'chain-opal',
      size: 40,
    },
  },
];
