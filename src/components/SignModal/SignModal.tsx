import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components/macro';

import { AccountSigner } from '@app/account';
import { useAccounts } from '@app/hooks';
import { Button, IdentityIcon, PasswordInput, Typography, Modal } from '@app/components';

export type TSignModalProps = {
  isVisible: boolean;
  onFinish(password: string): void;
  onClose(): void;
};

export const SignModal: FC<TSignModalProps> = ({ isVisible, onFinish, onClose }) => {
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const { signer } = useAccounts();

  const onSignClick = useCallback(() => {
    if (signer?.signerType !== AccountSigner.local) {
      return;
    }

    try {
      setPasswordError(undefined);
      if (password) {
        onFinish(password);
      }
    } catch (e) {
      setPasswordError('Unable to decode using the supplied passphrase');
    }

    setPassword('');
  }, [signer, password, onFinish]);

  if (!signer) {
    return null;
  }

  return (
    <Modal isVisible={isVisible} title="Authorize transaction" onClose={onClose}>
      <AddressWrapper>
        <IdentityIcon address={signer.address || ''} />
        <Typography>{signer.address || ''}</Typography>
      </AddressWrapper>
      <CredentialsWrapper>
        <PasswordInput placeholder="Password" value={password} onChange={setPassword} />
        {passwordError && <Typography color="coral-500">{passwordError}</Typography>}
      </CredentialsWrapper>
      <ButtonWrapper>
        <Button disabled={!password} role="primary" title="Sign" onClick={onSignClick} />
      </ButtonWrapper>
    </Modal>
  );
};

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
