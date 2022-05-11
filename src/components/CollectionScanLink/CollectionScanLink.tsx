import { VFC } from 'react';
import styled from 'styled-components';

import { ArrowUpRight } from '@app/static/icons/icons';
import { Primary500 } from '@app/styles/colors';

interface CollectionScanLinkProps {
  className?: string;
  collectionId: string;
}

// todo - replace icon from ui kit
export const CollectionScanLink: VFC<CollectionScanLinkProps> = styled(
  ({ className, collectionId }: CollectionScanLinkProps) => (
    <div className={className}>
      <a href={`https://uniquescan.io/QUARTZ/collections/${collectionId}`}>
        View collection on Scan <img alt="scan-link" src={ArrowUpRight} />
      </a>
    </div>
  ),
)`
  a {
    // todo - replace color from css var
    color: ${Primary500};
    font-size: 14px;
    line-height: 22px;
    display: flex;
    align-items: center;
    grid-column-gap: calc(var(--gap) / 2);
  }
`;
