import { useCallback, useState } from 'react';
import styled from 'styled-components';

import { Tree } from './Tree';
import { IBundleTree, INode } from './types';

function BundleTree<T extends INode>({
  dataSource,
  nodeView: NodeView,
  onNodeClicked: onNodeClickedProps,
  nestedSectionView: NestedSectionView,
  className,
  compareNodes,
  childrenProperty,
  getKey,
  onViewNodeDetails,
  onUnnestClick,
  onTransferClick,
}: IBundleTree<T>) {
  const [selectedToken, setSelectedToken] = useState<T | null>(null);
  const onNodeClicked = useCallback((data: T) => {
    setSelectedToken(data.selected ? data : null);
    onNodeClickedProps(data);
  }, []);

  return (
    <Wrapper>
      <Tree<T>
        dataSource={dataSource}
        nodeView={NodeView}
        className={className}
        compareNodes={compareNodes}
        childrenProperty={childrenProperty}
        getKey={getKey}
        onViewNodeDetails={onViewNodeDetails}
        onUnnestClick={onUnnestClick}
        onTransferClick={onTransferClick}
        onNodeClicked={onNodeClicked}
      />
      {NestedSectionView && (
        <NestedSectionView
          selectedToken={selectedToken}
          onViewNodeDetails={onViewNodeDetails}
          onUnnestClick={onUnnestClick}
          onTransferClick={onTransferClick}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
`;

export default BundleTree;
