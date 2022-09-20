import { createRef } from 'react';
import { Loader, Tooltip } from '@unique-nft/ui-kit';
import styled from 'styled-components';

import { EntityItem } from '@app/pages/components/ListEntitysCache/EntityItem';

export type TResultEntityCache = {
  path: string | undefined;
};

type Props = {
  entities: TResultEntityCache[];
  className?: string;
};

export const ListEntitiesCache = ({ entities, className }: Props) => {
  if (entities.length === 0) {
    return null;
  }

  const tooltipRef = createRef<HTMLDivElement>();

  return (
    <ListEntitiesCacheWrapper className={className}>
      <Tooltip targetRef={tooltipRef}>
        The system needs time to synchronize data with the blockchain. Please wait.
      </Tooltip>
      <TooltipWrapper ref={tooltipRef}>
        <Loader label="Data processing" placement="left" size="small" />
      </TooltipWrapper>

      <ListEntitiesWrapper>
        {entities.map(({ path }, idx) => (
          <EntityItem key={idx} path={path} />
        ))}
      </ListEntitiesWrapper>
    </ListEntitiesCacheWrapper>
  );
};

const TooltipWrapper = styled.div`
  display: inline-block;
`;

const ListEntitiesWrapper = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const ListEntitiesCacheWrapper = styled.div`
  .loader-label {
    color: var(--AdditionalColorDark);
  }
`;
