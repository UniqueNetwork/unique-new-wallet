import { ReactNode } from 'react';
import styled from 'styled-components';

import { TooltipWrapper } from '@app/components';

type Props = {
  achievement: string;
  tooltipDescription: ReactNode;
};

export const Achievement = ({ achievement, tooltipDescription }: Props) => (
  <AchievementWrapper>
    <TooltipWrapper message={tooltipDescription}>{achievement}</TooltipWrapper>
  </AchievementWrapper>
);

const AchievementWrapper = styled.span`
  background: var(--color-additional-light);
  border: 1px solid var(--color-blue-grey-200);
  border-radius: var(--prop-border-radius);
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 16px;
  font-weight: 500;
  z-index: 2;

  & > span {
    padding: 4px 8px;
  }
`;
