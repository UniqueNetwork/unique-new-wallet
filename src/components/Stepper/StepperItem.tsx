import { Fragment } from 'react';
import classNames from 'classnames';

import { Typography } from '../Typography';
import { StepperProps } from './Stepper';

type StepperItemProps = Pick<StepperProps, 'onClickStep'> & {
  description: string;
  isActive: boolean;
  step: number;
  isItem: boolean;
};

export const StepperItem = ({
  description,
  isActive,
  step,
  isItem,
  onClickStep,
}: StepperItemProps) => {
  const handleClickStep = () => {
    onClickStep?.(step);
  };

  const stepperItem = (
    <div className={classNames('step-item', { active: isActive })}>
      <div className="step-content" onClick={handleClickStep}>
        <Typography
          color="color-additional-light"
          weight="regular"
          size="l"
          className="step-number"
        >
          {step}
        </Typography>
        <div className="step-description-wrapper">
          <Typography weight="regular" color="color-blue-grey-500" className="step-description">
            {description}
          </Typography>
        </div>
      </div>
    </div>
  );
  if (isItem) {
    return (
      <Fragment key={step}>
        {stepperItem}
        <div className="step-item middle" />
      </Fragment>
    );
  }
  return stepperItem;
};
