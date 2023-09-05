import { createContext } from 'react';

import { StateType } from './hooks/useGestureResponder';
import { GridSettings } from './types';

export interface DraggableGridItemContextType {
  grid: GridSettings;
  dragging: boolean;
  top: number;
  disableDrag: boolean;
  mountWithTraverseTarget?: [number, number];
  left: number;
  index: number;
  endTraverse: () => void;
  onMove: (state: StateType, x: number, y: number) => void;
  onEnd: (state: StateType, x: number, y: number) => void;
  onStart: () => void;
  setRowHeight: (value: number) => void;
}

export const DraggableGridItemContext =
  createContext<DraggableGridItemContextType | null>(null);
