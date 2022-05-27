import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { Icon } from '@unique-nft/ui-kit';

export interface DropdownSelectProps<T> {
  className?: string;
  placeholder?: string;
  options: T[];
  value?: T;
  onChange(value: T): void;
  renderOption?(value: T): ReactNode | string;
}

export function DropdownSelect<T>({
  className,
  placeholder,
  options,
  value,
  onChange,
  renderOption,
}: DropdownSelectProps<T>) {
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const InputRef = useRef<HTMLDivElement>(null);
  const DropdownRef = useRef<HTMLDivElement>(null);

  const onClick = useCallback(() => {
    setIsDropdownVisible(!isDropdownVisible);
  }, [isDropdownVisible, setIsDropdownVisible]);

  const onOptionClick = useCallback(
    (option: T) => () => {
      setIsDropdownVisible(false);
      onChange(option);
    },
    [onChange],
  );

  const showOption = useCallback(
    (option: T) => {
      if (renderOption) return renderOption(option);
      if (Object.hasOwnProperty.call(option, 'title'))
        return (option as unknown as { title: string }).title;
      if (typeof option === 'string' || typeof option === 'number') return option;

      return null;
    },
    [renderOption],
  );

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        DropdownRef.current &&
        InputRef.current &&
        !InputRef.current.contains(event.target as Node) &&
        !DropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener('click', onClickOutside);
    return () => {
      document.removeEventListener('click', onClickOutside);
    };
  }, []);

  return (
    <SelectInputWrapper>
      <InputWrapper className={className} ref={InputRef} onClick={onClick}>
        {!value && placeholder && <Placeholder>{placeholder}</Placeholder>}
        {value && showOption(value)}
        {options.length > 0 && <Icon name={'triangle'} size={16} />}
      </InputWrapper>
      <Dropdown isOpen={isDropdownVisible} ref={DropdownRef}>
        {options.map((item, index) => (
          <OptionWrapper key={index} onClick={onOptionClick(item)}>
            {showOption(item)}
          </OptionWrapper>
        ))}
      </Dropdown>
    </SelectInputWrapper>
  );
}

const SelectInputWrapper = styled.div`
  position: relative;
`;

const InputWrapper = styled.div`
  box-sizing: border-box;
  border-radius: 4px;
  padding: calc(var(--prop-gap) / 2) var(--prop-gap);
  position: relative;
  min-height: 36px;
  display: flex;
  align-items: center;
  column-gap: calc(var(--prop-gap) / 2);
  input {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: none;
    background: transparent;
    width: 100%;
    outline: none;
    padding: var(--prop-gap);
  }
`;

const Dropdown = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  position: absolute;
  min-width: 100%;
  top: calc(100% + 4px);
  flex-direction: column;
  background: var(--color-additional-light);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  overflow: hidden;
  z-index: 10;
`;

const OptionWrapper = styled.div`
  padding: var(--prop-gap);
  cursor: pointer;
  &:hover {
    background: var(--color-primary-100);
    color: var(--color-primary-500);
  }
`;

const Placeholder = styled.div`
  color: var(--color-grey-500);
`;
