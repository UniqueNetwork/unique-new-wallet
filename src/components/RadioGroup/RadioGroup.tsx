/**
 * @author Roman Beganov <rbeganov@usetech.com>
 */

import classNames from 'classnames';
import './RadioGroup.scss';
import { forwardRef, LegacyRef, useState } from 'react';

export type RadioOptionValueType = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface RadioGroupProps {
  options: RadioOptionValueType[];
  size?: 's' | 'm';
  align?: 'vertical' | 'horizontal';
  onChange?: (value: RadioOptionValueType) => void;
  value?: string;
  defaultValue?: string | null;
}

export const RadioGroup = forwardRef(
  (
    {
      options,
      onChange,
      value: userValue,
      size = 's',
      align = 'vertical',
      defaultValue = null,
    }: RadioGroupProps,
    ref: LegacyRef<HTMLInputElement>,
  ) => {
    const [defaultRadioValue, setDefaultRadioValue] = useState(() => {
      if (!defaultValue && !userValue) {
        return options[0]?.value ?? null;
      }
      return defaultValue;
    });

    const handleChange = (radio: RadioOptionValueType) => {
      if (defaultRadioValue) {
        setDefaultRadioValue(radio.value);
      }
      onChange?.(radio);
    };

    return (
      <div className={`unique-radio-group-wrapper ${align}`}>
        {options.map((radio) => {
          const { disabled, value: radioValue, label } = radio;
          const value = defaultRadioValue ?? userValue;

          const isChecked = radioValue === value;
          return (
            <div
              className={classNames('unique-radio-item', `radio-size-${size}`, {
                disabled,
              })}
              key={radioValue}
            >
              <label htmlFor={radioValue}>
                <input
                  type="radio"
                  id={radioValue}
                  checked={isChecked}
                  hidden={true}
                  disabled={disabled}
                  ref={ref}
                  onChange={() => handleChange(radio)}
                />
                <span
                  className={classNames('inner', {
                    checked: isChecked,
                  })}
                />
                <span className="label">{label}</span>
              </label>
            </div>
          );
        })}
      </div>
    );
  },
);
