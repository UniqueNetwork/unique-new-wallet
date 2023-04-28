import styled from 'styled-components';

import { Stepper, StepperProps } from '../Stepper';

const steps: StepperProps['steps'] = ['Main information', 'Token attributes'];

const CollectionStepperWrapper = styled.div`
  margin: 0 calc(var(--prop-gap) * (-0.5)) calc(var(--prop-gap) * 2.5);
`;

export const CollectionStepper = ({
  activeStep,
  onClickStep,
}: Omit<StepperProps, 'steps'>) => {
  return (
    <CollectionStepperWrapper>
      <Stepper steps={steps} activeStep={activeStep} onClickStep={onClickStep} />
    </CollectionStepperWrapper>
  );
};
