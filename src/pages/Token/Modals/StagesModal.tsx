import React, { FC, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Text } from '@unique-nft/ui-kit';

import Loading from '../../../components/Loading';
import { Icon } from '../../../components/Icon/Icon';
import CheckCircle from '../../../static/icons/check-circle.svg';
import { Stage, StageStatus } from '../../../types/StagesTypes';

type TStagesModalProps = {
  stages: Stage[];
  status: StageStatus;
  onFinish: () => void; // TODO: copy-pasted
};

const DefaultMinterStages: FC<TStagesModalProps> = ({
  stages,
  status,
  onFinish
}) => {
  useEffect(() => {
    if (status === StageStatus.success || status === StageStatus.error) {
      setTimeout(() => onFinish(), 500);
    }
  }, [status]);

  return (
    <StageWrapper>
      {stages.map((stage, index) => (
        <React.Fragment key={`stage-${index}`}>
          <StatusWrapper>
            {(stage.status === StageStatus.inProgress ||
              stage.status === StageStatus.awaitingSign) && <Loading />}
            {stage.status === StageStatus.success && (
              <Icon path={CheckCircle} />
            )}
          </StatusWrapper>
          <TitleWrapper>
            <Text size={'m'}>{stage.title}</Text>
            <Text size={'s'} color={'grey-500'}>
              {`Step ${index + 1}`}
            </Text>
          </TitleWrapper>
        </React.Fragment>
      ))}
    </StageWrapper>
  );
};

export default DefaultMinterStages;

const StageWrapper = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  grid-column-gap: var(--gap);
  grid-row-gap: var(--gap);
`;

const StatusWrapper = styled.div`
  position: relative;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
