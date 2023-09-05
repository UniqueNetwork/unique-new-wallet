import React, {
  Children,
  HTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { SizeMap, useDeviceSize } from '@app/hooks';

import { StateType } from './hooks/useGestureResponder';
import { useMeasureRect } from './hooks/useMeasure';
import { DraggableGridContext } from './DraggableGridContext';
import { getPositionForIndex, getTargetIndex, swap } from './helpers';
import { DraggableGridItemContext } from './DraggableGridItemContext';

export interface DraggableGridProps extends HTMLAttributes<HTMLDivElement> {
  itemsPerRow: Record<string, number>;
  id: string;
  children: ReactNode[];
  disableDrag?: boolean;
  disableDrop?: boolean;
  className?: string;
}

interface PlaceholderType {
  startIndex: number;
  targetIndex: number;
}

export const DraggableGrid = ({
  id,
  itemsPerRow,
  children,
  className,
  disableDrag = false,
  disableDrop = false,
  ...other
}: DraggableGridProps) => {
  const deviceSize = useDeviceSize();
  const size = SizeMap[deviceSize];
  const {
    traverse,
    startTraverse,
    endTraverse,
    appendGrid: register,
    measureAll,
    onChange,
    remove,
    getActiveDropId,
  } = useContext(DraggableGridContext);

  const ref = useRef<HTMLDivElement>(null);
  const { bounds, remeasure } = useMeasureRect(ref);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [placeholder, setPlaceholder] = useState<PlaceholderType | null>(null);
  const [rowHeight, setRowHeight] = useState<number>(0);

  const traverseIndex =
    traverse && !traverse.execute && traverse.targetId === id
      ? traverse.targetIndex
      : null;

  const columnWidth = bounds.width / itemsPerRow[size];
  const childCount = Children.count(children);

  useEffect(() => {
    register(id, {
      top: bounds.top,
      bottom: bounds.bottom,
      left: bounds.left,
      right: bounds.right,
      width: bounds.width,
      height: bounds.height,
      count: childCount,
      columnWidth,
      itemsPerRow: itemsPerRow[size],
      rowHeight,
      disableDrop,
      remeasure,
    });
  }, [childCount, disableDrop, bounds, id, columnWidth, itemsPerRow[size], rowHeight]);

  useEffect(() => {
    return () => remove(id);
  }, [id]);

  const itemsIndexes = Children.map(children, (_, i) => i) || [];

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        height: rowHeight * Math.ceil(childCount / itemsPerRow[size]) + 'px',
      }}
      className={className}
      {...other}
    >
      {columnWidth === 0
        ? null
        : Children.map(children, (child, index) => {
            const isTraverseTarget =
              traverse && traverse.targetId === id && traverse.targetIndex === index;

            const order = placeholder
              ? swap(itemsIndexes, placeholder.startIndex, placeholder.targetIndex)
              : itemsIndexes;

            const pos = getPositionForIndex(
              order.indexOf(index),
              {
                columnWidth,
                itemsPerRow: itemsPerRow[size],
                rowHeight,
              },
              traverseIndex,
            );
            function onMove(state: StateType, x: number, y: number) {
              if (!ref.current) {
                return;
              }

              if (draggingIndex !== index) {
                setDraggingIndex(index);
              }

              const targetDropId = getActiveDropId(
                id,
                x + columnWidth / 2,
                y + rowHeight / 2,
              );

              if (targetDropId && targetDropId !== id) {
                startTraverse(id, targetDropId, x, y, index);
              } else {
                endTraverse();
              }

              const targetIndex =
                targetDropId !== id
                  ? childCount
                  : getTargetIndex(
                      index,
                      {
                        columnWidth,
                        itemsPerRow: itemsPerRow[size],
                        rowHeight,
                      },
                      childCount,
                      state.delta[0],
                      state.delta[1],
                    );

              if (targetIndex !== index) {
                if (
                  (placeholder && placeholder.targetIndex !== targetIndex) ||
                  !placeholder
                ) {
                  setPlaceholder({
                    targetIndex,
                    startIndex: index,
                  });
                }
              } else if (placeholder) {
                setPlaceholder(null);
              }
            }

            function onEnd(state: StateType, x: number, y: number) {
              const targetDropId = getActiveDropId(
                id,
                x + columnWidth / 2,
                y + rowHeight / 2,
              );

              const targetIndex =
                targetDropId !== id
                  ? childCount
                  : getTargetIndex(
                      index,
                      {
                        columnWidth,
                        itemsPerRow: itemsPerRow[size],
                        rowHeight,
                      },
                      childCount,
                      state.delta[0],
                      state.delta[1],
                    );

              // traverse?
              if (traverse) {
                onChange(
                  traverse.sourceId,
                  traverse.sourceIndex,
                  traverse.targetIndex,
                  traverse.targetId,
                );
              } else {
                onChange(id, index, targetIndex);
              }

              setPlaceholder(null);
              setDraggingIndex(null);
            }

            function onStart() {
              measureAll();
            }

            return (
              <DraggableGridItemContext.Provider
                value={{
                  top: pos.xy[1],
                  disableDrag,
                  endTraverse,
                  mountWithTraverseTarget: isTraverseTarget
                    ? [traverse.tx, traverse.ty]
                    : undefined,
                  left: pos.xy[0],
                  index,
                  dragging: index === draggingIndex,
                  grid: {
                    columnWidth,
                    itemsPerRow: itemsPerRow[size],
                    rowHeight,
                  },
                  onMove,
                  onEnd,
                  onStart,
                  setRowHeight,
                }}
              >
                {child}
              </DraggableGridItemContext.Provider>
            );
          })}
    </div>
  );
};
