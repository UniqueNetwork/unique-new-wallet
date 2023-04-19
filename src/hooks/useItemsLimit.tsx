import { useState } from 'react';

import { SizeMap, useDeviceSize } from '@app/hooks/useDeviceSize';

const DEFAULT_ITEMS_COUNT = 10;

export const useItemsLimit = (breakpoints: Record<string, number>) => {
  const deviceSize = useDeviceSize();
  const size = SizeMap[deviceSize];

  const [limits, setLimits] = useState(breakpoints || {});

  return {
    limit: size in limits ? limits[size] : DEFAULT_ITEMS_COUNT,
    setLimit: (limit: number) => setLimits({ ...limits, [size]: limit }),
  };
};
