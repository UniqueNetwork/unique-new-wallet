import React, { FC, useCallback, useState } from 'react';
import { Avatar, Button, Heading, Modal, Text } from '@unique-nft/ui-kit';
import keyring from '@polkadot/ui-keyring';
import styled from 'styled-components/macro';

import { PasswordInput } from '@app/components/PasswordInput/PasswordInput';
import { QRReader, ScannedResult } from '@app/components/QRReader/QRReader';
import { useAccounts } from '@app/hooks';

import { TCreateAccountModalProps } from './types';
import DefaultAvatar from '../../../static/icons/default-avatar.svg';

export const ImportViaQRCodeAccountModal: FC<TCreateAccountModalProps> = ({
  isVisible,
  onFinish,
}) => {
  const [address, setAddress] = useState<string>();
  const [scanned, setScanned] = useState<ScannedResult>();
  const [password, setPassword] = useState<string>('');
  const { addAccountViaQR } = useAccounts();

  const onScan = useCallback((scanned: ScannedResult) => {
    setScanned(scanned);

    setAddress(
      scanned.isAddress
        ? scanned.content
        : keyring.createFromUri(scanned.content, {}, 'sr25519').address,
    );
  }, []);

  const onSaveClick = useCallback(() => {
    if (!scanned) return;

    const { name, isAddress, content, genesisHash } = scanned;

    addAccountViaQR({
      name: name || 'unnamed',
      isAddress,
      content,
      genesisHash,
      password,
    });
    onFinish();
  }, [scanned, password, onFinish]);

  return (
    <Modal isVisible={isVisible} isClosable={true} onClose={onFinish}>
      <Content>
        <Heading size="2">{'Add an account via QR-code'}</Heading>
      </Content>
      <InputWrapper>
        <Text size={'m'}>
          Provide the account QR from the module/external application for scanning. Once
          detected as valid, you will be taken to the next step to add the account to your
          list.
        </Text>
        {!address && <QRReader onScan={onScan} />}
        {address && (
          <AddressWrapper>
            <Avatar size={24} src={DefaultAvatar} />
            <Text>{address}</Text>
          </AddressWrapper>
        )}
      </InputWrapper>
      <InputWrapper>
        <Text size={'m'}>Password</Text>
        <Text size={'s'} color={'grey-500'}>
          The password that was previously used to encrypt this account
        </Text>
        <PasswordInput placeholder={'Password'} value={password} onChange={setPassword} />
      </InputWrapper>

      <ButtonWrapper>
        <Button
          disabled={!address || !password}
          role="primary"
          title="Save"
          onClick={onSaveClick}
        />
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
`;

const InputWrapper = styled.div`
  padding: var(--prop-gap) 0;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--prop-gap);
  row-gap: var(--prop-gap);
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
