import { isValidElement, Key, ReactNode, useEffect, useState } from 'react';
import classNames from 'classnames';
import { ComponentProps } from '@unique-nft/ui-kit';

import { Icon, IconProps } from '@app/components/Icon';
import './Dropdown.scss';

export interface SelectOptionProps {
  [x: string | number | symbol]: unknown;
  type?: 'primary' | 'danger';
  iconLeft?: IconProps;
  iconRight?: IconProps;
}

export interface DropdownProps extends Omit<ComponentProps, 'onChange'> {
  open?: boolean;
  options?: SelectOptionProps[];
  optionKey?: string;
  optionValue?: string;
  placement?: 'left' | 'right';
  children: JSX.Element;
  iconLeft?: IconProps | ReactNode;
  iconRight?: IconProps | ReactNode;
  isTouch?: boolean;
  verticalOffset?: number | string;
  onChange?(option: SelectOptionProps): void;
  onOpenChange?(open: boolean): void;
  optionRender?(option: SelectOptionProps, isSelected: boolean): ReactNode;
  dropdownRender?(): ReactNode;
}

export const Dropdown = ({
  id,
  value,
  className,
  disabled,
  options,
  optionKey = 'id',
  optionValue = 'title',
  onChange,
  children,
  optionRender,
  dropdownRender,
  placement = 'left',
  iconLeft,
  iconRight,
  open,
  isTouch,
  verticalOffset,
  onOpenChange,
}: DropdownProps) => {
  const selected = options?.find(
    (option) => option[optionKey as keyof SelectOptionProps] === value,
  );

  const [dropped, setDropped] = useState<boolean>(!!open);

  useEffect(() => {
    setDropped(!!open);
  }, [open, setDropped]);

  const handleClickOutside = () => {
    document.removeEventListener('mousedown', handleClickOutside);
    setDropped(false);
    onOpenChange?.(false);
  };

  const handleMouseLeave = () => {
    document.addEventListener('mousedown', handleClickOutside);
  };

  const handleMouseEnter = () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };

  const handleOptionSelect = (option: SelectOptionProps) => {
    setDropped(false);
    onOpenChange?.(false);
    onChange?.(option);
  };

  const handleMouseClick = () => {
    if (disabled) {
      return;
    }

    setDropped(!dropped);
    onOpenChange?.(!dropped);
  };

  return (
    <div
      className={classNames('unique-dropdown', className, {
        touch: isTouch,
      })}
      id={id}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div
        className={classNames('dropdown-wrapper', {
          dropped,
          disabled,
        })}
        data-testid="dropdown-wrapper"
        onClick={handleMouseClick}
      >
        {iconLeft &&
          (isValidElement(iconLeft) ? iconRight : <Icon {...(iconLeft as IconProps)} />)}
        {children}
        {iconRight &&
          (isValidElement(iconRight) ? (
            iconRight
          ) : (
            <Icon {...(iconRight as IconProps)} />
          ))}
      </div>
      {dropped && (
        <div
          className={classNames('dropdown-options', {
            right: placement === 'right',
            touch: isTouch,
          })}
          role="listbox"
          {...(verticalOffset && {
            style: {
              top: verticalOffset,
              height: `calc(100vh - (${verticalOffset} + 36px))`,
            },
          })}
        >
          {dropdownRender?.()}
          {options?.map((option) => {
            const isSelected =
              option[optionKey as keyof SelectOptionProps] ===
              selected?.[optionKey as keyof SelectOptionProps];

            return (
              <div
                aria-selected={isSelected}
                className={classNames(
                  'dropdown-option',
                  `dropdown-option-${option.type}`,
                  {
                    selected: isSelected,
                    disabled,
                  },
                )}
                key={option[optionKey] as Key}
                role="option"
                onClick={() => handleOptionSelect(option)}
              >
                {optionRender?.(option, isSelected) ||
                  (option[optionValue as keyof SelectOptionProps] as string)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
