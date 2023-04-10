import React, { VFC } from 'react';
import styled from 'styled-components';

import { Stage, StageStatus } from '@app/types';

import { Icon } from '../Icon';
import { Loader, Typography } from '..';

interface StagesProps {
  stages: Stage[];
}

export const Stages: VFC<StagesProps> = ({ stages }) => {
  return (
    <StageWrapper>
      {stages.map((stage, index) => (
        <React.Fragment key={`stage-${index}`}>
          <StatusWrapper>
            {(stage.status === StageStatus.inProgress ||
              stage.status === StageStatus.awaitingSign) && <Loader isFullPage />}
            {stage.status === StageStatus.success && (
              <Icon name="check-circle" size={24} color="var(--color-additional-dark)" />
            )}
          </StatusWrapper>
          <TitleWrapper>
            <Typography size="m">{stage.title}</Typography>
            {stages.length > 1 && (
              <Typography size="s" color="grey-500">
                {`Step ${index + 1}`}
              </Typography>
            )}
          </TitleWrapper>
        </React.Fragment>
      ))}
    </StageWrapper>
  );
};

const StageWrapper = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  grid-column-gap: var(--gap);
  grid-row-gap: var(--gap);
  align-items: flex-start;
  margin-bottom: 10px;
`;

const StatusWrapper = styled.div`
  position: relative;
  height: 100%;
  > div {
    top: 12px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
