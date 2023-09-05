import { GridSettings } from './types';

export const getDragPosition = (
  index: number,
  grid: GridSettings,
  dx: number,
  dy: number,
  center?: boolean,
) => {
  const {
    xy: [left, top],
  } = getPositionForIndex(index, grid);
  return {
    xy: [
      left + dx + (center ? grid.columnWidth / 2 : 0),
      top + dy + (center ? grid.rowHeight / 2 : 0),
    ],
  };
};

export const getPositionForIndex = (
  i: number,
  { itemsPerRow, rowHeight, columnWidth }: GridSettings,
  traverseIndex?: number | false | null,
) => {
  const index = typeof traverseIndex === 'number' ? (i >= traverseIndex ? i + 1 : i) : i;
  const x = (index % itemsPerRow) * columnWidth;
  const y = Math.floor(index / itemsPerRow) * rowHeight;
  return {
    xy: [x, y],
  };
};

export const getIndexFromCoordinates = (
  x: number,
  y: number,
  { rowHeight, itemsPerRow, columnWidth }: GridSettings,
  count: number,
) => {
  const index = Math.floor(y / rowHeight) * itemsPerRow + Math.floor(x / columnWidth);
  return index >= count ? count : index;
};

export const getTargetIndex = (
  startIndex: number,
  grid: GridSettings,
  count: number,
  dx: number,
  dy: number,
) => {
  const {
    xy: [cx, cy],
  } = getDragPosition(startIndex, grid, dx, dy, true);
  return getIndexFromCoordinates(cx, cy, grid, count);
};

export const move = <T>(
  source: Array<T>,
  destination: Array<T>,
  droppableSource: number,
  droppableDestination: number,
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource, 1);
  destClone.splice(droppableDestination, 0, removed);
  return [sourceClone, destClone];
};

export const swap = <T>(array: Array<T>, moveIndex: number, toIndex: number) => {
  const item = array[moveIndex];
  const length = array.length;
  const diff = moveIndex - toIndex;

  if (diff > 0) {
    // move left
    return [
      ...array.slice(0, toIndex),
      item,
      ...array.slice(toIndex, moveIndex),
      ...array.slice(moveIndex + 1, length),
    ];
  } else if (diff < 0) {
    // move right
    const targetIndex = toIndex + 1;
    return [
      ...array.slice(0, moveIndex),
      ...array.slice(moveIndex + 1, targetIndex),
      item,
      ...array.slice(targetIndex, length),
    ];
  }
  return array;
};
