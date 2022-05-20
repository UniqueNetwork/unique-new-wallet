import React, { FC, useCallback, useState } from 'react';
import { Avatar, Button, Heading, Modal, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';
import { KeyringPair } from '@polkadot/keyring/types';

import { AccountSigner } from '@app/account';
import { useAccounts } from '@app/hooks';
import { PasswordInput } from '@app/components';

import DefaultAvatar from '../../static/icons/default-avatar.svg';

export type TSignModalProps = {
  isVisible: boolean;
  onFinish(signature?: KeyringPair): void;
  onClose(): void;
};

export const SignModal: FC<TSignModalProps> = ({ isVisible, onFinish, onClose }) => {
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const { selectedAccount, unlockLocalAccount } = useAccounts();

  const onSignClick = useCallback(() => {
    if (!selectedAccount || selectedAccount.signerType !== AccountSigner.local) return;
    try {
      setPasswordError(undefined);
      const signature = unlockLocalAccount(password);
      if (signature) {
        onFinish(signature);
      }
    } catch (e) {
      setPasswordError('Unable to decode using the supplied passphrase');
    }

    setPassword('');
  }, [selectedAccount, unlockLocalAccount, password, onFinish]);

  if (!selectedAccount) return null;

  return (
    <Modal isVisible={isVisible} isClosable={true} onClose={onClose}>
      <Content>
        <Heading size="2">{'Authorize transaction'}</Heading>
      </Content>
      <AddressWrapper>
        <Avatar size={24} src={DefaultAvatar} />
        <Text>{selectedAccount.address || ''}</Text>
      </AddressWrapper>
      <CredentialsWrapper>
        <PasswordInput placeholder={'Password'} value={password} onChange={setPassword} />
        {passwordError && <Text color={'coral-500'}>{passwordError}</Text>}
      </CredentialsWrapper>
      <ButtonWrapper>
        <Button disabled={!password} role="primary" title="Sign" onClick={onSignClick} />
      </ButtonWrapper>
    </Modal>
  );
};

const Content = styled.div`
  && h2 {
    margin-bottom: 0;
  }
`;
const AddressWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--prop-gap) / 2);
  margin: calc(var(--prop-gap) * 2) 0;
  border: 1px solid var(--color-grey-300);
  border-radius: 4px;
  padding: 20px var(--prop-gap);
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CredentialsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: calc(var(--prop-gap) / 2);
  margin-bottom: calc(var(--prop-gap) * 1.5);
  .unique-input-text {
    width: 100%;
  }
`;
