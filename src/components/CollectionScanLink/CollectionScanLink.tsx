import React, { VFC } from 'react';
import styled from 'styled-components';
import { Icon } from '@unique-nft/ui-kit';

interface CollectionScanLinkProps {
  className?: string;
  collectionId: string;
}

// todo - get link to scan from the env
export const CollectionScanLink: VFC<CollectionScanLinkProps> = styled(
  ({ className, collectionId }: CollectionScanLinkProps) => (
    <div className={className}>
      <a href={`https://uniquescan.io/QUARTZ/collections/${collectionId}`}>
        View collection on Scan <Icon name="arrow-up-right" size={80} />
      </a>
    </div>
  ),
)`
  a {
    color: var(--color-primary-500);
    font-size: 14px;
    line-height: 22px;
    display: flex;
    align-items: center;
    grid-column-gap: calc(var(--prop-gap) / 2);
  }
`;
