import { IconProps } from '@app/components';

export type NetworkType = 'QTZ' | 'OPL' | 'KSM' | 'UNQ' | string;

// TODO - share from the UI kit
export type INetwork = {
  id: string;
  name: string;
  icon: IconProps;
};
