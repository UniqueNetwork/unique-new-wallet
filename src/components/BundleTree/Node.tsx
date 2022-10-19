import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';

import { INode, INodeContainer } from './types';

export function Node<T extends INode>({
  data,
  onNodeClicked,
  nodeView: NodeView,
  isFirst,
  level,
  children,
  onViewNodeDetails,
  onTransferClick,
  onUnnestClick,
}: INodeContainer<T>) {
  const [isOpened, setIsOpened] = useState(data.opened);

  const arrowClicked = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setIsOpened(!isOpened);
    },
    [isOpened],
  );

  const textClicked = useCallback(() => {
    onNodeClicked?.(data);
  }, [data, onNodeClicked]);

  return (
    <NodeContainer
      isOpened={!!isOpened}
      className={classNames({ className: 'treenode', selected: !!data.selected })}
    >
      <NodeView
        arrowClicked={arrowClicked}
        isOpened={!!isOpened}
        data={data}
        textClicked={textClicked}
        isFirst={isFirst}
        level={level}
        isSelected={!!data.selected}
        isParentSelected={!!data.parentSelected}
        onViewNodeDetails={onViewNodeDetails}
        onUnnestClick={onUnnestClick}
        onTransferClick={onTransferClick}
      >
        {children}
      </NodeView>
    </NodeContainer>
  );
}

const NodeContainer = styled.div<{ isOpened: boolean }>`
  .treenode {
    display: ${({ isOpened }) => (!isOpened ? 'none' : 'block')};
    &.selected {
      background-color: var(--color-primary-100);
    }
  }
`;
