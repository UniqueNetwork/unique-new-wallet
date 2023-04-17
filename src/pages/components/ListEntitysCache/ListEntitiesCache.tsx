import { createRef } from 'react';
import styled from 'styled-components';

import { Loader, Tooltip } from '@app/components';
import { EntityItem } from '@app/pages/components/ListEntitysCache/EntityItem';

export type TResultEntityCache = {
  path?: string | undefined;
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
  flex-wrap: wrap;
  gap: var(--prop-gap);
  padding: calc(var(--prop-gap) * 1.5) 0 calc(var(--prop-gap) * 2);
`;

const ListEntitiesCacheWrapper = styled.div`
  flex: 0 0 auto;
  width: 100%;

  .loader-label {
    color: var(--AdditionalColorDark);
  }
`;
