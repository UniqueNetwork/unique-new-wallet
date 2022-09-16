import { useEffect, useMemo, useState } from 'react';

export enum DeviceSize {
  xs,
  sm,
  md,
  lg,
  xl,
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
    if (windowWidth && windowWidth < 567) {
      return DeviceSize.xs;
    }
    if (windowWidth && windowWidth < 769) {
      return DeviceSize.sm;
    }
    if (windowWidth && windowWidth < 1024) {
      return DeviceSize.md;
    }
    if (windowWidth && windowWidth < 1600) {
      return DeviceSize.lg;
    }

    return DeviceSize.xl;
  }, [windowWidth]);
};
