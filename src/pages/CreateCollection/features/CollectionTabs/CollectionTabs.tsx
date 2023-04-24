import { FC, memo, ReactNode, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { ConfirmBtn, Button, Stepper, StepperProps } from '@app/components';
import { ButtonGroup } from '@app/pages/components/FormComponents';

const CollectionStepperWrapper = styled.div`
  margin: 0 calc(var(--prop-gap) * (-0.5)) calc(var(--prop-gap) * 2.5);
`;

interface CollectionTabsProps extends Pick<StepperProps, 'onClickStep'> {
  children?: ReactNode;
  step: number;
  creationTooltip?: string;
  creationDisabled?: boolean;
  nextStepTooltip?: string;
  nextStepDisabled?: boolean;
  onClickNextStep?: (step: number) => void;
  onClickPreviousStep?: (step: number) => void;
  onCreateCollection?: () => void;
}

const steps: StepperProps['steps'] = ['Main information', 'Token attributes'];

const CollectionTabsComponent: FC<CollectionTabsProps> = ({
  children,
  step,
  creationTooltip,
  creationDisabled,
  nextStepTooltip,
  nextStepDisabled,
  onCreateCollection,
  onClickNextStep,
  onClickPreviousStep,
  onClickStep,
}) => {
  const firstStep = useRef(true);
  const lastStep = useRef(false);

  useEffect(() => {
    firstStep.current = step === 1;
    lastStep.current = step === steps.length;
  }, [step]);

  const onClickPreviousStepHandler = () => {
    onClickPreviousStep?.(step - 1);
  };

  const onClickNextStepHandler = () => {
    onClickNextStep?.(step + 1);
  };

  const onClickStepHandler = (selectedStep: number) => {
    if (selectedStep < step) {
      onClickStep?.(selectedStep);
    }
  };

  return (
    <>
      <CollectionStepperWrapper>
        <Stepper steps={steps} activeStep={step} onClickStep={onClickStepHandler} />
      </CollectionStepperWrapper>
      {children}
      <ButtonGroup>
        {!firstStep.current && (
          <Button
            iconLeft={{
              color: 'var(--color-primary-400)',
              name: 'arrow-left',
              size: 12,
            }}
            title="Previous step"
            onClick={onClickPreviousStepHandler}
          />
        )}
        {lastStep.current ? (
          <ConfirmBtn
            role="primary"
            title="Create collection"
            tooltip={creationTooltip}
            disabled={creationDisabled}
            onClick={onCreateCollection}
          />
        ) : (
          <ConfirmBtn
            iconRight={{
              color: 'currentColor',
              name: 'arrow-right',
              size: 12,
            }}
            title="Next step"
            tooltip={nextStepTooltip}
            disabled={nextStepDisabled}
            onClick={onClickNextStepHandler}
          />
        )}
      </ButtonGroup>
    </>
  );
};

export const CollectionTabs = memo(CollectionTabsComponent);
