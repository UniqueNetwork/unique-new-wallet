import { useEffect, useState } from 'react';

export const useTimer = (seconds = 0, stepSeconds = 1) => {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (!time) {
      return;
    }

    const timeout = setTimeout(() => {
      setTime(time - 1);
    }, stepSeconds * 1000);

    return () => clearTimeout(timeout);
  }, [time, stepSeconds]);
  return {
    time,
    setTime,
  };
};
