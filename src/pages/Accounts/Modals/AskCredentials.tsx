import React, { FC, useCallback, useMemo, useState } from 'react';
import { Button, InputText } from '@unique-nft/ui-kit';

import { IdentityIcon, PasswordInput } from '@app/components';
import {
  AdditionalText,
  AddressText,
  AddressWrapper,
  ButtonGroup,
  LabelText,
  StepsTextStyled,
} from '@app/pages/Accounts/Modals/commonComponents';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';

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

  const validPassword = useMemo(
    () => password === confirmPassword,
    [password, confirmPassword],
  );

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
          <AddressWrapper>
            <IdentityIcon address={accountProperties?.address || ''} />
            <AddressText>{accountProperties?.address || ''}</AddressText>
          </AddressWrapper>
        </ContentRow>
        <ContentRow>
          <LabelText size="m">Name</LabelText>
          <AdditionalText size="s" color="grey-500">
            Give your account a name for easier identification and handling.
          </AdditionalText>
          <InputText value={name} onChange={onAccountNameChange} />
        </ContentRow>
        <ContentRow>
          <LabelText size="m">Password</LabelText>
          <AdditionalText size="s" color="grey-500">
            This is necessary to authenticate all committed transactions and encrypt the
            key pair. Ensure you are using a strong password for proper account
            protection.
          </AdditionalText>
          <PasswordInput value={password} onChange={setPassword} />
        </ContentRow>
        <ContentRow>
          <LabelText size="m">Repeat password</LabelText>
          <PasswordInput value={confirmPassword} onChange={setConfirmPassword} />
        </ContentRow>
      </ModalContent>
      <ModalFooter>
        <StepsTextStyled size="m">Step 2/3</StepsTextStyled>
        <ButtonGroup>
          <Button title="Previous" onClick={onGoBack} />
          <Button
            disabled={!validPassword || !password || !name}
            role="primary"
            title="Next"
            onClick={onNextClick}
          />
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};
