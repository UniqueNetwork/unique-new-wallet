import React, { VFC } from 'react';
import styled from 'styled-components';
import { Icon } from '@unique-nft/ui-kit';

import { useApi } from '@app/hooks';

interface CollectionScanLinkProps {
  className?: string;
  collectionId: string;
}

const Wrapper = styled.div`
  .scan-external-link {
    color: var(--color-primary-500);
    line-height: 1.5;

    .icon {
      display: inline-block;
      vertical-align: middle;
      margin-left: 0.35em;
    }
  }
`;

export const CollectionScanLink: VFC<CollectionScanLinkProps> = ({
  className,
  collectionId,
}: CollectionScanLinkProps) => {
  const { currentChain } = useApi();
  return (
    <Wrapper className={className}>
      <a
        className="scan-external-link"
        href={`${currentChain.uniquescanAddress}/collections/${collectionId}`}
        target="_blank"
        rel="noreferrer noopener"
      >
        View collection on Scan
        <Icon color="currentColor" name="arrow-up-right" size={16} />
      </a>
    </Wrapper>
  );
};
