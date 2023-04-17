import { forwardRef, LegacyRef } from 'react';
import classNames from 'classnames';

import { ComponentProps } from '../types';
import './Textarea.scss';
import { InputBaseProps } from '../InputText';

interface BaseTextareaProps extends InputBaseProps {
  // number of rows to display in textarea
  rows?: number;
}

export type TextareaProps = BaseTextareaProps & Omit<ComponentProps, 'onChange'>;

export const Textarea = forwardRef(
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
      onChange,
      testid,
      size = 'middle',
      rows = 3,
      ...rest
    }: TextareaProps,
    ref: LegacyRef<HTMLTextAreaElement>,
  ) => {
    return (
      <div
        className={classNames('unique-textarea-text', `size-${size}`, className, {
          error,
        })}
      >
        {label && <label htmlFor={id}>{label}</label>}
        {additionalText && <div className="additional-text">{additionalText}</div>}
        <div
          className={classNames('textarea-wrapper', {
            disabled,
          })}
        >
          <textarea
            id={id}
            data-testid={testid}
            disabled={disabled}
            value={value}
            rows={rows}
            ref={ref}
            {...(onChange && {
              onChange: (e) => onChange(e.target.value),
            })}
            {...rest}
          />
        </div>
        {statusText && <div className="status-text">{statusText}</div>}
      </div>
    );
  },
);
