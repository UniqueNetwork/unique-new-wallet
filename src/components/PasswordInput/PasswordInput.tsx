import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';

import { Grey500 } from '@app/styles/colors';
import { Icon } from '@app/components';
import Eye from '../../static/icons/eye.svg';
import EyeClosed from '../../static/icons/eye-closed.svg';

interface PasswordInputProps {
  placeholder?: string
  value: string
  onChange(value: string): void
}

// todo - use from ui-kit
export const PasswordInput: FC<PasswordInputProps> = ({ placeholder, value, onChange }) => {
  const [isVisibleValue, setIsVisibleValue] = useState<boolean>(false);

  const onPasswordChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
    onChange(target.value);
  }, [onChange]);

  const onVisibleValueClick = useCallback(() => {
    setIsVisibleValue(!isVisibleValue);
  }, [isVisibleValue]);

  return (
    <PasswordInputWrapper>
      <PasswordInputStyled type={isVisibleValue ? 'text' : 'password'}
        onChange={onPasswordChange}
        value={value}
        placeholder={placeholder}
      />
      <Icon path={isVisibleValue ? Eye : EyeClosed} onClick={onVisibleValueClick} size={24} />
    </PasswordInputWrapper>
  );
};

const PasswordInputWrapper = styled.div`
  border: 1px solid #d2d3d6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding-right: calc(var(--gap) / 2);
`;

const PasswordInputStyled = styled.input`
  border: none;
  padding: 11px 12px;
  flex-grow: 1;
  outline: 0px none transparent;
  &::placeholder {
    color: ${Grey500};
  }
`;
