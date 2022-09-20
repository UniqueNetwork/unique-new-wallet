import { DeviceSize, useDeviceSize } from '@app/hooks/useDeviceSize';

export const useItemsLimit = (): any => {
  const deviceSize = useDeviceSize();
  return () => {
    switch (deviceSize) {
      case DeviceSize.sm:
      case DeviceSize.lg:
      case DeviceSize.xl:
        return 8;
      case DeviceSize.md:
        return 9;
      case DeviceSize.xxl:
      default:
        return 10;
    }
  };
};
