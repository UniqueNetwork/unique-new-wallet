import React, { FC, useCallback, useState } from 'react';
import { Button, Heading, Modal } from '@unique-nft/ui-kit';
import { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';

import { PasswordInput, Upload } from '@app/components';
import {
  AdditionalText,
  LabelText,
  ModalHeader,
  TextWarning,
} from '@app/pages/Accounts/Modals/commonComponents';
import {
  ContentRow,
  ModalContent,
  ModalFooter,
} from '@app/pages/components/ModalComponents';

import { TCreateAccountModalProps } from './types';

export const ImportViaJSONAccountModal: FC<TCreateAccountModalProps> = ({
  isVisible,
  onFinish,
}) => {
  const [pair, setPair] = useState<KeyringPair | null>(null);
  const [password, setPassword] = useState<string>('');

  // todo - rawRpcApi.genesisHash.toHex() change to value from the API /chain/properties genesisHash
  const onUploadChange = useCallback((file: File) => {
    /*  const reader = new FileReader();
       reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
         if (target && target.result) {
           const data = convertToU8a(target.result as ArrayBuffer);
           setPair(keyringFromFile(data, rawRpcApi.genesisHash.toHex()));
         }
       };

       reader.readAsArrayBuffer(file);
     }, */
  }, []);

  const onRestoreClick = useCallback(() => {
    if (!pair || !password) return;
    try {
      keyring.addPair(pair, password);
    } catch (error) {
      console.error(error);
    }
    onFinish();
  }, [pair, password, onFinish]);

  return (
    <Modal isVisible={isVisible} isClosable={true} onClose={onFinish}>
      <ModalHeader>
        <Heading size="2">Add an account via backup JSON file</Heading>
      </ModalHeader>
      <ModalContent>
        <ContentRow>
          <LabelText size={'m'}>Upload</LabelText>
          <AdditionalText size={'s'} color={'grey-500'}>
            Click to select or drop the file here
          </AdditionalText>
          <Upload onChange={onUploadChange} />
        </ContentRow>
        <ContentRow>
          <LabelText size={'m'}>Password</LabelText>
          <AdditionalText size={'s'} color={'grey-500'}>
            The password that was previously used to encrypt this account
          </AdditionalText>
          <PasswordInput
            placeholder={'Password'}
            value={password}
            onChange={setPassword}
          />
        </ContentRow>
        <ContentRow>
          <TextWarning color="additional-warning-500" size="s">
            Consider storing your account in a signer such as a browser extension,
            hardware device, QR-capable phone wallet (non-connected) or desktop
            application for optimal account security. Future versions of the web-only
            interface will drop support for non-external accounts, much like the IPFS
            version.
          </TextWarning>
        </ContentRow>
      </ModalContent>
      <ModalFooter>
        <Button
          disabled={!password || !pair}
          role="primary"
          title="Restore"
          onClick={onRestoreClick}
        />
      </ModalFooter>
    </Modal>
  );
};
