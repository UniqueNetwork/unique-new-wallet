import { VFC } from 'react';
import styled from 'styled-components';

import { ArrowUpRight } from '@app/static/icons/icons';

interface CollectionScanLinkProps {
  className?: string;
  collectionId: string;
}

export const CollectionScanLink: VFC<CollectionScanLinkProps> = styled(
  ({ className, collectionId }: CollectionScanLinkProps) => (
    <div className={className}>
      <a href={`https://uniquescan.io/QUARTZ/collections/${collectionId}`}>
        View collection on Scan <img alt="scan-link" src={ArrowUpRight} />
      </a>
    </div>
  ),
)``;
