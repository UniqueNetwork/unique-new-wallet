export interface GridSettings {
  itemsPerRow: number;
  rowHeight: number;
  columnWidth: number;
}

interface ItemRenderProps {
  grid: GridSettings;
  disabled: boolean;
  dragging: boolean;
}

export type ItemRender = (
  component: any,
  props: any,
  state: ItemRenderProps & { index: number },
) => React.ReactNode;

export interface TraverseType {
  sourceId: string;
  targetId: string;
  rx: number;
  ry: number;
  tx: number;
  ty: number;
  sourceIndex: number;
  targetIndex: number;
  execute?: boolean;
}
