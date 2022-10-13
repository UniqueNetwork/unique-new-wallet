import { SizeMap, useDeviceSize } from '@app/hooks/useDeviceSize';

const DEFAULT_ITEMS_COUNT = 10;

export const useItemsLimit = (breakpoints: Record<string, number>): number => {
  const deviceSize = useDeviceSize();
  const size = SizeMap[deviceSize];

  if (!breakpoints) {
    return DEFAULT_ITEMS_COUNT;
  }

  return size in breakpoints ? breakpoints[size] : DEFAULT_ITEMS_COUNT;
};
