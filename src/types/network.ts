import { IconProps } from '@unique-nft/ui-kit';

export type NetworkType = 'QTZ' | 'OPL' | 'KSM' | 'UNQ';

// TODO - share from the UI kit
export type INetwork = {
  id: string;
  name: string;
  icon: IconProps;
};
