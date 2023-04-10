import classNames from 'classnames';
import './Checkbox.scss';
import { ReactNode, forwardRef, LegacyRef } from 'react';

import { Icon, IconProps } from '../';
import { ComponentProps } from '../types';

export interface CheckboxProps extends Omit<ComponentProps, 'onChange'> {
  checked: boolean;
  label: ReactNode;
  size?: 's' | 'm';
  disabled?: boolean;
  onChange: (value: boolean) => void;
  iconRight?: IconProps;
  iconLeft?: IconProps;
}

export const Checkbox = forwardRef(
  (
    {
      id,
      name,
      checked,
      label,
      disabled,
      size = 's',
      onChange,
      iconRight,
      iconLeft,
    }: CheckboxProps,
    ref: LegacyRef<HTMLInputElement>,
  ) => {
    const icon = iconLeft || iconRight;
    return (
      <div
        className={classNames('unique-checkbox-wrapper', `checkbox-size-${size}`, {
          disabled,
        })}
        {...(!disabled && {
          onClick: () => onChange(!checked),
        })}
      >
        <input
          type="checkbox"
          name={name}
          id={id}
          className="checkbox"
          checked={checked}
          ref={ref}
          onChange={(e) => e.preventDefault()}
        />
        <span className={classNames('checkmark', { checked })}>
          {checked && <Icon name="checked" color="#fff" size={size === 's' ? 16 : 18} />}
        </span>

        <label
          className={classNames('checkbox-label', {
            'icon-left': iconLeft,
            'icon-right': iconRight,
          })}
        >
          {icon && <Icon {...icon} />}
          <span>{label}</span>
        </label>
      </div>
    );
  },
);
