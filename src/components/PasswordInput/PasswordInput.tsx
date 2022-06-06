import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import { Icon } from '@unique-nft/ui-kit';

interface PasswordInputProps {
  placeholder?: string;
  value: string;
  onChange(value: string): void;
}

// todo - use from ui-kit - can't use until InputText hasn't props type="password" or role="password"
export const PasswordInput: FC<PasswordInputProps> = ({
  placeholder,
  value,
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
    <PasswordInputWrapper>
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

const PasswordInputWrapper = styled.div`
  border: 1px solid var(--color-grey-300);
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
