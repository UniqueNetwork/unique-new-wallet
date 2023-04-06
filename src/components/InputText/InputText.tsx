/* eslint-disable no-empty-character-class */

import React, { ForwardedRef, ReactNode } from 'react';
import classNames from 'classnames';
import { ComponentProps, DimentionType } from '@unique-nft/ui-kit';

import { Button, IconType, userIcon } from '@app/components';

import './InputText.scss';

export interface InputBaseProps {
  additionalText?: ReactNode;
  clearable?: boolean;
  error?: boolean;
  label?: ReactNode;
  statusText?: string;
  size?: DimentionType;
  onChange?(value: string): void;
  onClear?: () => void;
}

export type InputTextProps = InputBaseProps &
  Omit<ComponentProps, 'onChange'> & {
    iconLeft?: IconType;
    iconRight?: IconType;
    role?: 'number' | 'decimal';
  };

export const InputText = React.forwardRef(
  (
    {
      id,
      label,
      additionalText,
      statusText,
      className,
      clearable,
      error,
      disabled,
      value = '',
      iconLeft,
      iconRight,
      role,
      size = 'middle',
      testid,
      onChange,
      onClear,
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
          'to-right': iconRight || clearable,
          clearable,
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
        {clearable && value ? (
          <Button
            className="unique-button-icon"
            iconRight={{
              color: 'currentColor',
              name: 'clear',
              size: 24,
            }}
            role="ghost"
            title=""
            onClick={onClear}
          />
        ) : (
          userIcon(iconRight)
        )}
      </div>

      {statusText && <div className="status-text">{statusText}</div>}
    </div>
  ),
);
