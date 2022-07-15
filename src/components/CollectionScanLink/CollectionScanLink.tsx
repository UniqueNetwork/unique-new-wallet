import React, { VFC } from 'react';
import styled from 'styled-components';
import { Icon } from '@unique-nft/ui-kit';

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

// todo - get link to scan from the env
export const CollectionScanLink: VFC<CollectionScanLinkProps> = ({
  className,
  collectionId,
}: CollectionScanLinkProps) => (
  <Wrapper className={className}>
    <a
      className="scan-external-link"
      href={`https://uniquescan.io/QUARTZ/collections/${collectionId}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      View collection on Scan
      <Icon color="currentColor" name="arrow-up-right" size={16} />
    </a>
  </Wrapper>
);
