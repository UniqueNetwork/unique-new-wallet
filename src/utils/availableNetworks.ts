import { Chain } from '@app/types';

// TODO - use urls from ENV
export const networks: Chain[] = [
  {
    apiEndpoint: 'https://web.uniquenetwork.dev/',
    id: 'quartz',
    name: 'Quartz',
    icon: {
      name: 'chain-quartz',
      size: 40,
    },
  },
  {
    apiEndpoint: 'https://web.uniquenetwork.dev/',
    id: 'opal',
    name: 'Opal',
    icon: {
      name: 'chain-opal',
      size: 40,
    },
  },
];
