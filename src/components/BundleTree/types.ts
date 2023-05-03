import { MouseEvent, FC, ReactNode } from 'react';
import { GetBundleResponse } from '@unique-nft/sdk';

export interface INestingToken extends GetBundleResponse {
  opened?: boolean;
  disabled?: boolean;
  selected?: boolean;
  isCurrentAccountOwner?: boolean;
  name?: string;
  collectionName?: string;
  isFractional?: boolean;
  nestingParentOwner?: string;
}

export interface ITokenCard {
  token: INestingToken;
  onViewNodeDetails?: (token: INestingToken) => void;
  onUnnestClick?: (token: INestingToken) => void;
  onTransferClick?: (token: INestingToken) => void;
}

export interface INestedSectionView<T> {
  selectedToken: T | null;
  onViewNodeDetails?: (node: T) => void;
  onUnnestClick?: (node: T) => void;
  onTransferClick?: (node: T) => void;
}

export interface INodeView<T> {
  arrowClicked: (event: MouseEvent) => void;
  isOpened: boolean;
  isSelected: boolean;
  isParentSelected: boolean;
  data: T;
  textClicked: (event: MouseEvent) => void;
  level: number;
  onViewNodeDetails?: (node: T) => void;
  onUnnestClick?: (node: T) => void;
  onTransferClick?: (node: T) => void;
}

export interface INode {
  opened?: boolean;
  disabled?: boolean;
  selected?: boolean;
  parentSelected?: boolean;
}

export type TTreeNodeClickHandler<T> = (data: T) => void;

export interface INodeContainer<T> {
  data: T;
  nodeView: FC<INodeView<T>>;
  onNodeClicked: TTreeNodeClickHandler<T>;
  getKey: (a: T) => string;
  childrenProperty: keyof T;
  level: number;
  children?: ReactNode;
  onViewNodeDetails?: (node: T) => void;
  onUnnestClick?: (node: T) => void;
  onTransferClick?: (node: T) => void;
}

export interface ITree<T> {
  dataSource: T[];
  nodeView: FC<INodeView<T>>;
  onNodeClicked: TTreeNodeClickHandler<T>;
  className?: string;
  compareNodes: (a: T, b: T) => boolean;
  getKey: (a: T) => string;
  childrenProperty: keyof T;
  onViewNodeDetails?: (node: T) => void;
  onUnnestClick?: (node: T) => void;
  onTransferClick?: (node: T) => void;
  selectedToken?: T;
}

export interface IBundleTree<T> extends ITree<T> {
  nestedSectionView?: FC<INestedSectionView<T>>;
}
