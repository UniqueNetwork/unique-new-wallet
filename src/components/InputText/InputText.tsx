/* eslint-disable react/display-name */
/* eslint-disable no-empty-character-class */

import { ForwardedRef, forwardRef, ReactNode } from 'react';
import { ComponentProps, DimentionType, IconType, userIcon } from '@unique-nft/ui-kit';
import classNames from 'classnames';

import './InputText.scss';

export interface InputBaseProps {
  additionalText?: string;
  error?: boolean;
  label?: ReactNode;
  statusText?: string;
  size?: DimentionType;
  onChange?(value: string): void;
}

export type InputTextProps = InputBaseProps &
  Omit<ComponentProps, 'onChange'> & {
    iconLeft?: IconType;
    iconRight?: IconType;
    role?: 'number' | 'decimal';
  };

export const InputText = forwardRef(
  (
    {
      id,
      label,
      additionalText,
      statusText,
      className,
      error,
      disabled,
      value = '',
      iconLeft,
      iconRight,
      onChange,
      role,
      size = 'middle',
      testid,
      ...rest
    }: InputTextProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => (
    <div
      className={classNames('unique-input-text', `size-${size}`, className, { error })}
    >
      {label && <label htmlFor={id}>{label}</label>}
      {additionalText && <div className="additional-text">{additionalText}</div>}

      <div
        className={classNames('input-wrapper', {
          'with-icon': iconLeft || iconRight,
          'to-left': iconLeft,
          'to-right': iconRight,
          disabled,
        })}
      >
        {userIcon(iconLeft)}
        <input
          type="text"
          id={id}
          disabled={disabled}
          value={value}
          ref={ref}
          data-testid={testid}
          {...(onChange && {
            onChange: (e) =>
              onChange(e.target.value.replace(role === 'number' ? /\D/g : /[]/, '')),
          })}
          {...rest}
        />
        {userIcon(iconRight)}
      </div>
      {statusText && <div className="status-text">{statusText}</div>}
    </div>
  ),
);
