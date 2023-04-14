import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';

import { Icon } from '../Icon';

interface PasswordInputProps {
  placeholder?: string;
  isError?: boolean;
  value: string;
  onChange(value: string): void;
}

export const PasswordInput: FC<PasswordInputProps> = ({
  placeholder,
  value,
  isError,
  onChange,
}) => {
  const [isVisibleValue, setIsVisibleValue] = useState<boolean>(false);

  const onPasswordChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      onChange(target.value);
    },
    [onChange],
  );

  const onVisibleValueClick = useCallback(() => {
    setIsVisibleValue(!isVisibleValue);
  }, [isVisibleValue]);

  return (
    <PasswordInputWrapper isError={!!isError}>
      <PasswordInputStyled
        type={isVisibleValue ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={onPasswordChange}
      />
      <IconWrapper onClick={onVisibleValueClick}>
        <Icon name={isVisibleValue ? 'eye' : 'eye-closed'} size={24} />
      </IconWrapper>
    </PasswordInputWrapper>
  );
};

const PasswordInputWrapper = styled.div<{ isError: boolean }>`
  border: 1px solid
    var(${({ isError }) => (isError ? '--color-coral-500' : '--color-grey-300')});
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding-right: calc(var(--prop-gap) / 2);
`;

const PasswordInputStyled = styled.input`
  border: none;
  padding: 11px 12px;
  flex-grow: 1;
  outline: 0px none transparent;
  &::placeholder {
    color: var(--color-grey-500);
  }
`;

const IconWrapper = styled.div`
  cursor: pointer;
`;
