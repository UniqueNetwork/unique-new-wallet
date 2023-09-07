import React, { createContext, ReactNode, useRef, useState } from 'react';

import { Rect } from './hooks/useMeasure';
import { TraverseType } from './types';
import { getPositionForIndex, getIndexFromCoordinates } from './helpers';

interface GridOptions extends Rect {
  count: number;
  itemsPerRow: number;
  rowHeight: number;
  columnWidth: number;
  disableDrop: boolean;
  remeasure: () => void;
}

interface DraggableGridContextType {
  appendGrid: (id: string, options: GridOptions) => void;
  remove: (id: string) => void;
  measureAll: () => void;
  getActiveDropId: (sourceId: string, x: number, y: number) => string | null;
  startTraverse: (
    sourceId: string,
    targetId: string,
    x: number,
    y: number,
    sourceIndex: number,
  ) => void;
  traverse: TraverseType | null;
  endTraverse: () => void;
  onChange: (
    sourceId: string,
    sourceIndex: number,
    targetIndex: number,
    targetId?: string,
  ) => void;
}

const noop = () => {
  throw new Error('Make sure that you have wrapped your drop zones with GridContext');
};

export const DraggableGridContext = createContext<DraggableGridContextType>({
  appendGrid: noop,
  remove: noop,
  getActiveDropId: noop,
  startTraverse: noop,
  measureAll: noop,
  traverse: null,
  endTraverse: noop,
  onChange: noop,
});

interface DraggableGridContextProviderProps {
  children: ReactNode;
  onChange: (
    sourceId: string,
    sourceIndex: number,
    targetIndex: number,
    targetId?: string,
  ) => void;
}

export const DraggableGridContextProvider = ({
  children,
  onChange,
}: DraggableGridContextProviderProps) => {
  const [traverse, setTraverse] = useState<TraverseType | null>(null);
  const dropRefs = useRef<Map<string, GridOptions>>(new Map());

  function register(id: string, options: GridOptions) {
    dropRefs.current.set(id, options);
  }

  function remove(id: string) {
    dropRefs.current.delete(id);
  }

  function getFixedPosition(sourceId: string, rx: number, ry: number) {
    const item = dropRefs.current.get(sourceId)!;

    if (!item) {
      return {
        x: rx,
        y: ry,
      };
    }

    const { left, top } = item;

    return {
      x: left + rx,
      y: top + ry,
    };
  }

  function getRelativePosition(targetId: string, fx: number, fy: number) {
    const { left, top } = dropRefs.current.get(targetId)!;
    return {
      x: fx - left,
      y: fy - top,
    };
  }

  function diffDropzones(sourceId: string, targetId: string) {
    const sBounds = dropRefs.current.get(sourceId)!;
    const tBounds = dropRefs.current.get(targetId)!;

    return {
      x: tBounds.left - sBounds.left,
      y: tBounds.top - sBounds.top,
    };
  }

  function getActiveDropId(sourceId: string, x: number, y: number) {
    const { x: fx, y: fy } = getFixedPosition(sourceId, x, y);
    // probably faster just using an array for dropRefs
    for (const [key, bounds] of dropRefs.current.entries()) {
      if (
        !bounds.disableDrop &&
        fx > bounds.left &&
        fx < bounds.right &&
        fy > bounds.top &&
        fy < bounds.bottom
      ) {
        return key;
      }
    }

    return null;
  }

  function startTraverse(
    sourceId: string,
    targetId: string,
    x: number,
    y: number,
    sourceIndex: number,
  ) {
    const { x: fx, y: fy } = getFixedPosition(sourceId, x, y);
    const { x: rx, y: ry } = getRelativePosition(targetId, fx, fy);
    const targetGrid = dropRefs.current.get(targetId)!;

    const targetIndex = getIndexFromCoordinates(
      rx + targetGrid.columnWidth / 2,
      ry + targetGrid.rowHeight / 2,
      targetGrid,
      targetGrid.count,
    );

    const {
      xy: [px, py],
    } = getPositionForIndex(targetIndex, targetGrid);

    const { x: dx, y: dy } = diffDropzones(sourceId, targetId);

    if (
      !traverse ||
      !(
        traverse &&
        traverse.targetIndex !== targetIndex &&
        traverse.targetId !== targetId
      )
    ) {
      setTraverse({
        rx: px + dx,
        ry: py + dy,
        tx: rx,
        ty: ry,
        sourceId,
        targetId,
        sourceIndex,
        targetIndex,
      });
    }
  }

  function endTraverse() {
    setTraverse(null);
  }

  function onSwitch(
    sourceId: string,
    sourceIndex: number,
    targetIndex: number,
    targetId?: string,
  ) {
    if (traverse?.sourceId) {
      setTraverse({
        ...traverse,
        execute: true,
      });
    }

    onChange(sourceId, sourceIndex, targetIndex, targetId);
  }

  function measureAll() {
    dropRefs.current.forEach((ref) => {
      ref.remeasure();
    });
  }

  return (
    <DraggableGridContext.Provider
      value={{
        appendGrid: register,
        remove,
        getActiveDropId,
        startTraverse,
        traverse,
        measureAll,
        endTraverse,
        onChange: onSwitch,
      }}
    >
      {children}
    </DraggableGridContext.Provider>
  );
};
