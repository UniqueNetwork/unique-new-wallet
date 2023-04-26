/**
 * @author Roman Beganov <rbeganov@usetech.com>
 */

import classNames from 'classnames';
import { ReactNode } from 'react';
import './Toggle.scss';

export interface ToggleProps {
  label: ReactNode;
  on?: boolean;
  size?: 's' | 'm';
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

export const Toggle = ({
  on = false,
  label,
  size = 's',
  disabled,
  onChange,
}: ToggleProps) => {
  return (
    <div
      className={classNames('unique-toggle-wrapper', `toggle-size-${size}`, {
        disabled,
      })}
      {...(!disabled && {
        onClick: () => onChange(!on),
      })}
    >
      <span className={classNames('inner', { on })} />
      <label>{label}</label>
    </div>
  );
};
