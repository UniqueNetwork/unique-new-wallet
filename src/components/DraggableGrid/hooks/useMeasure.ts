import { RefObject, useLayoutEffect, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export type Rect = Omit<DOMRect, 'x' | 'y' | 'toJSON'>;

export const useMeasureRect = (ref: RefObject<HTMLDivElement | null>) => {
  const [bounds, setBounds] = useState<Rect>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    right: 0,
    bottom: 0,
  });

  const [observer] = useState(
    () =>
      new ResizeObserver(([entry]) => {
        setBounds(entry.target.getBoundingClientRect());
      }),
  );

  useLayoutEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [ref, observer]);

  const remeasure = () => {
    setBounds(ref.current!.getBoundingClientRect());
  };

  return { bounds, remeasure };
};
