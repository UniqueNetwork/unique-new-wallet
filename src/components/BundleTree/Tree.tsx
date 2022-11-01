import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { INode, INodeContainer, ITree } from './types';
import { Node } from './Node';

const level = 1;
export function Tree<T extends INode>({
  dataSource,
  nodeView,
  onNodeClicked,
  className,
  compareNodes,
  childrenProperty,
  getKey,
  onViewNodeDetails,
  onTransferClick,
  onUnnestClick,
}: ITree<T>) {
  const [dataSourceState, setDataSourceState] = useState(dataSource);

  useEffect(() => {
    setDataSourceState(dataSource);
  }, [dataSource]);

  const nodeClickHandler = useCallback(
    (data: T) => {
      const selectNode = (node: T) => {
        if (compareNodes(node, data)) {
          node.selected = !node.selected;
        } else {
          node.selected = false;
        }
        (node[childrenProperty] as unknown as T[])?.forEach((child: T) => {
          return selectNode(child);
        });
        return node;
      };

      const markSelectedNodeChildren = (node: T, grandParentSelected?: boolean) => {
        if (node.selected || grandParentSelected) {
          (node[childrenProperty] as unknown as T[])?.forEach((child: T) => {
            child.parentSelected = true;
            markSelectedNodeChildren(child, true);
          });
        } else {
          (node[childrenProperty] as unknown as T[])?.forEach((child: T) => {
            child.parentSelected = false;
            markSelectedNodeChildren(child);
          });
        }
        return node;
      };

      let newDataSourceState = [...dataSourceState];
      newDataSourceState = [selectNode(newDataSourceState[0])];
      newDataSourceState = [markSelectedNodeChildren(newDataSourceState[0])];
      setDataSourceState(newDataSourceState);

      onNodeClicked?.(data);
    },
    [onNodeClicked, dataSourceState],
  );

  return (
    <TreeStyled className={className}>
      {dataSourceState.map((data: T, index) => (
        <Node<T>
          key={getKey(data)}
          data={data}
          nodeView={nodeView}
          isFirst={index === 0}
          level={level}
          getKey={getKey}
          childrenProperty={childrenProperty}
          onViewNodeDetails={onViewNodeDetails}
          onTransferClick={onTransferClick}
          onUnnestClick={onUnnestClick}
          onNodeClicked={nodeClickHandler}
        >
          {(data[childrenProperty] as unknown as T[])?.map((node: T) =>
            iter<T>({
              data: node,
              onNodeClicked: nodeClickHandler,
              nodeView,
              level,
              getKey,
              childrenProperty,
              onViewNodeDetails,
              onTransferClick,
              onUnnestClick,
            }),
          )}
        </Node>
      ))}
    </TreeStyled>
  );
}

const TreeStyled = styled.div`
  overflow: auto;
  flex: 1 1 auto;
  width: 100%;

  @media (min-width: 1024px) {
    flex: 0 0 auto;
    width: 536px;
  }
`;

// iterate through datasource and return treenode
function iter<T extends INode>({
  data,
  onNodeClicked,
  nodeView,
  level,
  getKey,
  childrenProperty,
  onViewNodeDetails,
  onTransferClick,
  onUnnestClick,
}: INodeContainer<T>) {
  const nextLevel = Number(level) + 1;
  return (
    <Node
      key={getKey(data)}
      data={data}
      nodeView={nodeView}
      level={nextLevel}
      getKey={getKey}
      childrenProperty={childrenProperty}
      onViewNodeDetails={onViewNodeDetails}
      onTransferClick={onTransferClick}
      onUnnestClick={onUnnestClick}
      onNodeClicked={onNodeClicked}
    >
      {(data[childrenProperty] as unknown as T[])?.map((val: T) => {
        return iter({
          data: val,
          onNodeClicked,
          nodeView,
          level: nextLevel,
          childrenProperty,
          getKey,
          onViewNodeDetails,
          onTransferClick,
          onUnnestClick,
        });
      })}
    </Node>
  );
}
