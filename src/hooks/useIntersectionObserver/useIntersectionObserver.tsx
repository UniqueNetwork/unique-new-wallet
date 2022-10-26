import { useState, useRef, useEffect, useCallback } from 'react';

type IntersectionObserverParams = {
  callback?: () => void;
  options?: IntersectionObserverInit;
  isActive: boolean;
};

export function useIntersectionObserver({
  callback: userCallback,
  options,
  isActive,
}: IntersectionObserverParams) {
  const [isVisibleIntersectionObserver, setVisibleIntersectionObserver] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const callback = useCallback(
    (entries) => {
      if (entries.length === 0) {
        return;
      }

      if (entries[0].isIntersecting && isActive) {
        setVisibleIntersectionObserver(true);
        userCallback?.();
      }
    },
    [userCallback, isActive],
  );

  const intersectionObserverRef = useCallback(
    (node) => {
      if (!node) {
        return;
      }

      observer.current?.disconnect();

      observer.current = new IntersectionObserver(callback, options);
      observer.current.observe(node);
    },
    [callback],
  );

  useEffect(() => {
    return () => observer.current?.disconnect();
  }, []);

  if (!userCallback) {
    return {
      intersectionObserverRef: null,
      isVisibleIntersectionObserver: false,
    };
  }

  return { intersectionObserverRef, isVisibleIntersectionObserver };
}
