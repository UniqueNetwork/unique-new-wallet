import styled from 'styled-components';
import { Stepper } from '@unique-nft/ui-kit';
import { StepperProps } from '@unique-nft/ui-kit/dist/cjs/components/Stepper/Stepper';

const steps: StepperProps['steps'] = ['Main information', 'NFT attributes'];

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
