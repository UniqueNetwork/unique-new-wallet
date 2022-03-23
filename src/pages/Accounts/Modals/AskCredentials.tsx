import React, { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';
import { TCreateAccountBodyModalProps } from './types';
import { Avatar, Button, InputText, Text } from '@unique-nft/ui-kit';
import DefaultAvatar from '../../../static/icons/default-avatar.svg';
import styled from 'styled-components/macro';
import { PasswordInput } from '../../../components/PasswordInput/PasswordInput';

export const AskCredentialsModal: FC<TCreateAccountBodyModalProps> = ({ accountProperties, onFinish, onGoBack }) => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const onAccountNameChange = useCallback((value: string) => {
    setName(value);
  }, []);

  const validPassword = useMemo(() => password === confirmPassword, [password, confirmPassword]);

  const onNextClick = useCallback(() => {
    if (!accountProperties) return;
    onFinish({ ...accountProperties, name, password });
  }, [name, password]);

  return (<>
    <AddressWrapper>
      <Avatar size={24} src={DefaultAvatar} />
      <Text>{accountProperties?.address || ''}</Text>
    </AddressWrapper>
    <CredentialsWrapper >
      <Text size={'m'}>Name</Text>
      <Text size={'s'} color={'grey-500'}>Give your account a name for easier identification and handling. </Text>
      <InputText onChange={onAccountNameChange} value={name} />

      <Text size={'m'}>Password</Text>
      <Text size={'s'} color={'grey-500'}>This is necessary to authenticate all committed transactions and encrypt the key pair. Ensure you are using a strong password for proper account protection. </Text>
      <PasswordInput
        onChange={setPassword}
        value={password}
      />
      <Text size={'m'}>Repeat password</Text>
      <PasswordInput
        onChange={setConfirmPassword}
        value={confirmPassword}
      />
    </CredentialsWrapper>
    <ButtonWrapper>
      <StepsTextStyled size={'m'}>Step 2/3</StepsTextStyled>
      <Button
        onClick={onGoBack}
        title='Previous'
      />
      <Button
        disabled={!validPassword || !password || !name}
        onClick={onNextClick}
        role='primary'
        title='Next'
      />
    </ButtonWrapper>
  </>);
};

const AddressWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--gap) / 2);
  margin-top: calc(var(--gap) * 2);
  border: 1px solid var(--grey-300);
  border-radius: 4px;
  padding: 20px var(--gap);
`;

const StepsTextStyled = styled(Text)`
  flex-grow: 1;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: var(--gap);
  align-items: center;
`;

const CredentialsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--gap) / 2);
  margin-bottom: calc(var(--gap) * 1.5);
  .unique-text.size-m {
    margin-top: calc(var(--gap) * 2);
  }
  .unique-input-text {
    width: 100%;
  }
`;
