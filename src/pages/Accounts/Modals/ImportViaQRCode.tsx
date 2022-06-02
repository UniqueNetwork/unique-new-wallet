import React, { FC, useCallback, useState } from 'react';
import { Avatar, Button, Heading, Modal, Text } from '@unique-nft/ui-kit';
import keyring from '@polkadot/ui-keyring';
import styled from 'styled-components/macro';

import { PasswordInput } from '@app/components/PasswordInput/PasswordInput';
import { QRReader, ScannedResult } from '@app/components/QRReader/QRReader';
import { useAccounts } from '@app/hooks';
import {
  AdditionalText,
  LabelText,
  ModalHeader,
} from '@app/pages/Accounts/Modals/commonComponents';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';

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
      <ModalHeader>
        <Heading size="2">Add an account via QR-code</Heading>
      </ModalHeader>
      <ModalContent>
        <ContentRow>
          <Text size="m">
            Provide the account QR from the module/external application for scanning. Once
            detected as valid, you will be taken to the next step to add the account to
            your list.
          </Text>
        </ContentRow>
        <ContentRow>
          {address ? (
            <AddressWrapper>
              <Avatar size={24} src={DefaultAvatar} />
              <Text>{address}</Text>
            </AddressWrapper>
          ) : (
            <QRReader onScan={onScan} />
          )}
        </ContentRow>
        <ContentRow>
          <LabelText size="m">Password</LabelText>
          <AdditionalText size="s" color="grey-500">
            The password that was previously used to encrypt this account
          </AdditionalText>
          <PasswordInput placeholder="Password" value={password} onChange={setPassword} />
        </ContentRow>
      </ModalContent>
      <ModalFooter>
        <Button
          disabled={!address || !password}
          role="primary"
          title="Save"
          onClick={onSaveClick}
        />
      </ModalFooter>
    </Modal>
  );
};

const AddressWrapper = styled.div`
  display: flex;
  column-gap: calc(var(--prop-gap) / 2);
  margin: calc(var(--prop-gap) * 2) 0;
`;
