import React, { VFC } from 'react';
import styled from 'styled-components';
import { Icon, Text, Heading, Loader } from '@unique-nft/ui-kit';

import { Stage, StageStatus } from '@app/types';

interface StagesProps {
  stages: Stage[];
}

export const Stages: VFC<StagesProps> = ({ stages }) => {
  return (
    <>
      <HeadingWrapper>
        <Heading size="2">Please wait</Heading>
      </HeadingWrapper>
      <StageWrapper>
        {stages.map((stage, index) => (
          <React.Fragment key={`stage-${index}`}>
            <StatusWrapper>
              {(stage.status === StageStatus.inProgress ||
                stage.status === StageStatus.awaitingSign) && <Loader isFullPage />}
              {stage.status === StageStatus.success && (
                <Icon
                  name="check-circle"
                  size={24}
                  color="var(--color-additional-dark)"
                />
              )}
            </StatusWrapper>
            <TitleWrapper>
              <Text size="m">{stage.title}</Text>
              {stages.length > 1 && (
                <Text size="s" color="grey-500">
                  {`Step ${index + 1}`}
                </Text>
              )}
            </TitleWrapper>
          </React.Fragment>
        ))}
      </StageWrapper>
    </>
  );
};

const StageWrapper = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  grid-column-gap: var(--gap);
  grid-row-gap: var(--gap);
  align-items: flex-start;
`;

const StatusWrapper = styled.div`
  position: relative;
  height: 100%;
  > div {
    top: 12px;
  }
`;

const HeadingWrapper = styled.div`
  margin-bottom: 16px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
