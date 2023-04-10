import { memo } from 'react';
import styled from 'styled-components';

import { Stepper, StepperProps } from '@app/components';

const steps: StepperProps['steps'] = ['Main information', 'NFT attributes'];

const CollectionStepperWrapper = styled.div`
  margin: 0 calc(var(--prop-gap) * (-0.5)) calc(var(--prop-gap) * 2.5);
  div.steps div.step-item div.step-content {
    cursor: default;
  }
`;

const CollectionStepperComponent = ({
  activeStep,
  onClickStep,
}: Omit<StepperProps, 'steps'>) => {
  return (
    <CollectionStepperWrapper>
      <Stepper steps={steps} activeStep={activeStep} onClickStep={onClickStep} />
    </CollectionStepperWrapper>
  );
};

export const CollectionStepper = memo(CollectionStepperComponent);
