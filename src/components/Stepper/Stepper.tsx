import React from 'react';

import { StepperItem } from './StepperItem';
import './Stepper.scss';

export interface StepperProps {
  activeStep: number;
  steps: string[];
  onClickStep?(step: number): void;
}

export const Stepper = ({ activeStep, steps, onClickStep }: StepperProps) => {
  return (
    <div className="unique-stepper">
      <div className="steps">
        {steps.map((description, index) => {
          const step = index + 1;
          return (
            <StepperItem
              key={step}
              step={step}
              description={description}
              isActive={activeStep === step}
              isItem={steps.length === 2 && index === 0}
              onClickStep={onClickStep}
            />
          );
        })}
      </div>
    </div>
  );
};
