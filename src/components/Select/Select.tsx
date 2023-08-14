import { Key, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

import { Icon } from '..';
import { ComponentProps, DimentionType, SelectOptionProps } from '../types';

import './Select.scss';

export interface SelectProps extends ComponentProps {
  options: SelectOptionProps[];
  optionKey?: string;
  optionValue?: string;
  additionalText?: string | number;
  error?: boolean;
  label?: ReactNode;
  statusText?: string;
  size?: DimentionType;
  multi?: boolean;
  values?: string[] | undefined;
  onChange(option: SelectOptionProps | SelectOptionProps[]): void;
}

export const Select = ({
  id,
  value,
  autoFocus,
  label,
  additionalText,
  statusText,
  className,
  defaultValue,
  error,
  options,
  placeholder,
  disabled,
  tabIndex = -1,
  size = 'middle',
  optionKey = 'id',
  optionValue = 'title',
  onChange,
  onFocus,
  onBlur,
  multi = false,
  values,
  testid,
}: SelectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const defaultOption =
      defaultValue && options.find((option) => option[optionKey] === defaultValue);
    defaultOption && onChange(defaultOption);
  }, []);

  const selected = options.find(
    (option) => option[optionKey as keyof SelectOptionProps] === value,
  );

  const selectedMulti: SelectOptionProps[] = useMemo(
    () =>
      multi && values
        ? (values
            .map((value) => {
              return options.find(
                (item) => item[optionKey as keyof SelectOptionProps] === value,
              );
            })
            .filter((item) => !!item) as SelectOptionProps[])
        : [],
    [multi, options, values],
  );

  const icon = selected?.iconLeft || selected?.iconRight;

  const [dropped, setDropped] = useState<boolean>(!!autoFocus);

  const handleMouseDown = () => {
    !disabled && setDropped(!dropped);
  };

  const handleClickOutside = () => {
    document.removeEventListener('mousedown', handleClickOutside);
    setDropped(false);
  };

  const handleMouseLeave = () => {
    document.addEventListener('mousedown', handleClickOutside);
  };

  const handleMouseEnter = () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };

  const handleOptionSelect = (option: SelectOptionProps) => {
    setDropped(false);
    if (multi) {
      onChange?.([...selectedMulti, option]);
    } else {
      onChange?.(option);
    }
  };

  const handleOptionUnselect = (option: SelectOptionProps) => {
    !disabled &&
      multi &&
      onChange?.(
        selectedMulti.filter(
          (item) =>
            option[optionKey as keyof SelectOptionProps] !==
            item[optionKey as keyof SelectOptionProps],
        ),
      );
  };

  const isSelected = (option: SelectOptionProps) => {
    if (multi) {
      return selectedMulti.some(
        (item) =>
          option[optionKey as keyof SelectOptionProps] ===
          item[optionKey as keyof SelectOptionProps],
      );
    } else {
      return (
        option[optionKey as keyof SelectOptionProps] ===
        selected?.[optionKey as keyof SelectOptionProps]
      );
    }
  };

  useEffect(() => {
    if (!containerRef.current || !dropdownRef.current) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    console.dir(rect, containerRef.current);
    dropdownRef.current.style.width = `${rect.width}px`;
    dropdownRef.current.style.top = `${rect.y + rect.height + window.scrollY + 4}px`;
    dropdownRef.current.style.left = `${rect.x + window.scrollX}px`;
  }, [dropped]);

  useEffect(() => {
    const onResize = () => {
      setDropped(false);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  });

  return (
    <div
      className={classNames('unique-select', `size-${size}`, className, {
        error,
      })}
      ref={containerRef}
    >
      {label && <label htmlFor={id}>{label}</label>}
      {additionalText && <div className="additional-text">{additionalText}</div>}
      <div
        className={classNames('select-wrapper', {
          dropped,
          disabled,
        })}
        tabIndex={tabIndex}
        id={id}
        data-testid={testid}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <Icon name="triangle" size={8} />
        <div
          className={classNames('select-value', {
            'with-icon': icon,
            'to-left': selected?.iconLeft,
            'to-right': selected?.iconRight,
            multi,
          })}
          onMouseDown={handleMouseDown}
        >
          {multi &&
            selectedMulti.length > 0 &&
            selectedMulti.map((selectedOption, index) => (
              <div className="select-tag" key={index}>
                {selectedOption?.[optionValue as keyof SelectOptionProps]}
                <div onClick={() => handleOptionUnselect(selectedOption)}>
                  <Icon size={10} name="close" color="white" />
                </div>
              </div>
            ))}
          {!multi && (
            <>
              {selected?.[optionValue as keyof SelectOptionProps]}
              {icon && <Icon {...icon} />}
            </>
          )}
          {!(multi && selectedMulti.length) && !(!multi && selected) && placeholder && (
            <span className="select-placeholder">{placeholder}</span>
          )}
        </div>
        {dropped &&
          options &&
          createPortal(
            <div className="select-dropdown" ref={dropdownRef}>
              {options.map((option) => {
                const icon = option.iconLeft || option.iconRight;
                const selected = isSelected(option);
                return (
                  <div
                    className={classNames('dropdown-option', {
                      selected,
                      'with-icon': icon,
                      'to-left': option.iconLeft,
                      'to-right': option.iconRight,
                      disabled,
                    })}
                    key={option[optionKey] as Key}
                    onClick={() =>
                      selected && multi
                        ? handleOptionUnselect(option)
                        : handleOptionSelect(option)
                    }
                  >
                    {option[optionValue as keyof SelectOptionProps]}
                    {icon && <Icon {...icon} />}
                  </div>
                );
              })}
            </div>,
            document.body,
          )}
      </div>
      {statusText && <div className="status-text">{statusText}</div>}
    </div>
  );
};
