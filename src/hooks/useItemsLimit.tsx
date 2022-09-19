import { DeviceSize, useDeviceSize } from '@app/hooks/useDeviceSize';

interface getLimitResult {
  limit(): any;
}

export const getLimit = (): any => {
  const deviceSize = useDeviceSize();
  const getLimit = () => {
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

  return getLimit;
};
