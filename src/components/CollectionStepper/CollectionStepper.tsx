import { Stepper } from '@unique-nft/ui-kit';
import { StepperProps } from '@unique-nft/ui-kit/dist/cjs/components/Stepper/Stepper';
import './CollectionStepper.scss';

const steps: StepperProps['steps'] = ['Main information', 'NFT attributes'];

export const CollectionStepper = ({ activeStep }: Pick<StepperProps, 'activeStep'>) => {
  return (
    <div className="collection-stepper">
      <Stepper steps={steps} activeStep={activeStep} />
    </div>
  );
};
