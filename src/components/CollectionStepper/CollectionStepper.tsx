import { Stepper } from '@unique-nft/ui-kit';
import { TBaseStepperProps } from '@unique-nft/ui-kit/dist/cjs/components/Stepper/Stepper';
import './CollectionStepper.scss';

const steps: TBaseStepperProps['steps'] = ['Main information', 'NFT attributes'];

export const CollectionStepper = ({
  activeStep,
}: Pick<TBaseStepperProps, 'activeStep'>) => {
  return (
    <div className="collection-stepper">
      <Stepper steps={steps} activeStep={activeStep} />
    </div>
  );
};
