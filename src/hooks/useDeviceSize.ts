import { useEffect, useMemo, useState } from 'react';

export enum DeviceSize {
  sm,
  md,
  lg
}

const useDeviceSize = (): DeviceSize => {
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
    if (windowWidth && windowWidth < 768) return DeviceSize.sm;
    if (windowWidth && windowWidth < 1025) return DeviceSize.md;

    return DeviceSize.lg;
  }, [windowWidth]);
};

export default useDeviceSize;
