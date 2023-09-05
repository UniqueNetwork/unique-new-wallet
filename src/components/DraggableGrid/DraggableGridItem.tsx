import React, { HTMLAttributes, ReactNode, useContext, useEffect, useRef } from 'react';
import { animated, to, useSpring } from 'react-spring';

import {
  StateType,
  useGestureResponder,
  ResponderEvent,
} from './hooks/useGestureResponder';
import { DraggableGridItemContext } from './DraggableGridItemContext';

interface DraggableGridItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const DraggableGridItem = ({
  children,
  style,
  className,
  ...other
}: DraggableGridItemProps) => {
  const context = useContext(DraggableGridItemContext);

  if (!context) {
    throw Error('DraggableGridItemContext not found');
  }

  const {
    top,
    disableDrag,
    endTraverse,
    onStart,
    mountWithTraverseTarget,
    left,
    index,
    onMove,
    onEnd,
    grid,
    dragging: isDragging,
    setRowHeight,
  } = context;

  const { columnWidth } = grid;
  const dragging = useRef(false);
  const startCoords = useRef([left, top]);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (index !== 0) {
      return;
    }
    setRowHeight(elementRef.current?.clientHeight || 0);
    const onResize = () => {
      setRowHeight(elementRef.current?.clientHeight || 0);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const [styles, set] = useSpring(() => {
    if (mountWithTraverseTarget) {
      const mountXY = mountWithTraverseTarget;

      endTraverse();

      return {
        xy: mountXY,
        immediate: true,
        zIndex: '1',
        scale: 1.1,
        opacity: 0.8,
      };
    }

    return {
      xy: [left, top],
      immediate: true,
      zIndex: '0',
      scale: 1,
      opacity: 1,
    };
  });

  function handleMove(state: StateType, e: ResponderEvent) {
    const x = startCoords.current[0] + state.delta[0];
    const y = startCoords.current[1] + state.delta[1];
    set({
      xy: [x, y],
      zIndex: '1',
      immediate: true,
      opacity: 0.8,
      scale: 1.1,
    });

    onMove(state, x, y);
  }

  function handleEnd(state: StateType) {
    const x = startCoords.current[0] + state.delta[0];
    const y = startCoords.current[1] + state.delta[1];
    dragging.current = false;
    onEnd(state, x, y);
  }

  const { bind } = useGestureResponder(
    {
      onMoveShouldSet: (state) => {
        if (disableDrag) {
          return false;
        }

        onStart();

        startCoords.current = [left, top];
        dragging.current = true;
        return true;
      },
      onMove: handleMove,
      onTerminationRequest: () => {
        if (dragging.current) {
          return false;
        }

        return true;
      },
      onTerminate: handleEnd,
      onRelease: handleEnd,
    },
    {
      enableMouse: true,
    },
  );

  useEffect(() => {
    if (!dragging.current) {
      set({
        xy: [left, top],
        zIndex: '0',
        opacity: 1,
        scale: 1,
        immediate: false,
      });
    }
  }, [dragging.current, left, top]);

  const _style = {
    cursor: disableDrag ? 'grab' : undefined,
    zIndex: styles.zIndex,
    position: 'absolute',
    width: columnWidth + 'px',
    opacity: styles.opacity,
    boxSizing: 'border-box',
    transform: to(
      [styles.xy, styles.scale],
      (xy: any, s: any) => `translate3d(${xy[0]}px, ${xy[1]}px, 0) scale(${s})`,
    ),
    ...style,
  };

  const props = {
    className:
      'GridItem' +
      (isDragging ? ' dragging' : '') +
      (disableDrag ? ' disabled' : '') +
      className
        ? ` ${className}`
        : '',
    ...bind,
    style: _style,
    ...other,
  };

  return typeof children === 'function' ? (
    children(animated.div, props, {
      dragging: isDragging,
      disabled: !!disableDrag,
      index,
      grid,
    })
  ) : (
    // @ts-ignore
    <animated.div ref={elementRef} {...props}>
      {children}
    </animated.div>
  );
};
