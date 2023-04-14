import React, { FC, useCallback, useMemo, useState } from 'react';

import { Button, PasswordInput, InputText } from '@app/components';
import {
  AdditionalText,
  LabelText,
  StatusText,
  StepsTextStyled,
} from '@app/pages/Accounts/Modals/commonComponents';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';
import { ButtonGroup } from '@app/pages/components/FormComponents';
import { AddressWidget } from '@app/pages/Accounts/components/AddressWidget';

import { TCreateAccountBodyModalProps } from './types';

export const AskCredentialsModal: FC<TCreateAccountBodyModalProps> = ({
  accountProperties,
  onFinish,
  onGoBack,
}) => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const onAccountNameChange = useCallback((value: string) => {
    setName(value);
  }, []);

  const validPassword = useMemo(() => !password || password.length > 4, [password]);

  const validConfirmPassword = useMemo(
    () => password === confirmPassword,
    [password, confirmPassword],
  );

  const validName = useMemo(() => !name || name.trim().length > 2, [name]);

  const onNextClick = useCallback(() => {
    if (!accountProperties) {
      return;
    }

    onFinish({ ...accountProperties, name, password });
  }, [name, password]);

  return (
    <>
      <ModalContent>
        <ContentRow>
          <AddressWidget address={accountProperties?.address} />
        </ContentRow>
        <ContentRow>
          <LabelText size="m">Name</LabelText>
          <AdditionalText size="s" color="grey-500">
            Give your account a name for easier identification and handling.
          </AdditionalText>
          <InputText
            error={!validName}
            statusText={!validName ? 'Name must be 3 characters or more' : undefined}
            value={name}
            onChange={onAccountNameChange}
          />
        </ContentRow>
        <ContentRow>
          <LabelText size="m">Password</LabelText>
          <AdditionalText size="s" color="grey-500">
            This is necessary to authenticate all committed transactions and encrypt the
            key pair. Ensure you are using a strong password for proper account
            protection.
          </AdditionalText>
          <PasswordInput
            isError={!validPassword}
            value={password}
            onChange={setPassword}
          />
          {!validPassword && (
            <StatusText>Your password is too small, at least 5 characters</StatusText>
          )}
        </ContentRow>
        <ContentRow>
          <LabelText size="m">Repeat password</LabelText>
          <PasswordInput
            isError={!validConfirmPassword}
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          {!validConfirmPassword && (
            <StatusText>Your password and confirmation password do not match</StatusText>
          )}
        </ContentRow>
      </ModalContent>
      <ModalFooter>
        <StepsTextStyled size="m">Step 2/3</StepsTextStyled>
        <ButtonGroup stack>
          <Button title="Previous" onClick={onGoBack} />
          <Button
            disabled={
              !name || !password || !validPassword || !validConfirmPassword || !validName
            }
            role="primary"
            title="Next"
            onClick={onNextClick}
          />
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};
