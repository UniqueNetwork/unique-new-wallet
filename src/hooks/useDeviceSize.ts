import { useEffect, useMemo, useState } from 'react';

export enum DeviceSize {
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
}

export enum SizeMap {
  xs = 0,
  sm = 1,
  md = 2,
  lg = 3,
  xl = 4,
  xxl = 5,
}

export const useDeviceSize = (): DeviceSize => {
  const [windowWidth, setWindowWidth] = useState<number | undefined>();

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width to state
      setWindowWidth(window.innerWidth);
    }

    // Add event listener
    window.addEventListener('resize', handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return useMemo(() => {
    if (windowWidth && windowWidth < 568) {
      return DeviceSize.xs;
    }
    if (windowWidth && windowWidth < 768) {
      return DeviceSize.sm;
    }
    if (windowWidth && windowWidth < 1024) {
      return DeviceSize.md;
    }
    if (windowWidth && windowWidth < 1280) {
      return DeviceSize.lg;
    }
    if (windowWidth && windowWidth < 1440) {
      return DeviceSize.xl;
    }
    if (windowWidth && windowWidth < 1920) {
      return DeviceSize.xxl;
    }

    return DeviceSize.xxl;
  }, [windowWidth]);
};
