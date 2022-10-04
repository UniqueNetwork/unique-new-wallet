import React, { FC, useCallback, useState } from 'react';
import { Button, Text } from '@unique-nft/ui-kit';
import keyring from '@polkadot/ui-keyring';
import styled from 'styled-components/macro';

import { Modal } from '@app/components/Modal';
import { PasswordInput } from '@app/components/PasswordInput/PasswordInput';
import { QRReader, ScannedResult } from '@app/components/QRReader/QRReader';
import { useAccounts } from '@app/hooks';
import { AdditionalText, LabelText } from '@app/pages/Accounts/Modals/commonComponents';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';
import { IdentityIcon } from '@app/components';

import { TCreateAccountModalProps } from './types';

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
    if (!scanned) {
      return;
    }

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
    <Modal isVisible={isVisible} title="Add an account via QR-code" onClose={onFinish}>
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
              <IdentityIcon address={address} />
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
