import { useEffect, useState } from 'react';

// determines whether the screen width is less than the threshold
export const useScreenWidthFromThreshold = (threshold: number): { lessThanThreshold: boolean } => {
  const media = window.matchMedia(`(max-width: ${threshold}px)`);
  const [lessThanThreshold, setLessThanThreshold] = useState(media.matches);

  useEffect(() => {
    const listener = () => {
      setLessThanThreshold(media.matches);
    };

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [media.matches]);

  return { lessThanThreshold };
};
