import React, { FC, useCallback, useState } from 'react';
import { Button, Heading, Modal, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';

import { TCreateAccountModalProps } from './types';
import { AdditionalWarning100 } from '../../../styles/colors';
import { PasswordInput } from '../../../components/PasswordInput/PasswordInput';
import { Upload } from '../../../components/Upload/Upload';
import { convertToU8a, keyringFromFile } from '../../../utils/jsonUtils';
import { KeyringPair } from '@polkadot/keyring/types';
import { useApi } from '../../../hooks/useApi';
import keyring from '@polkadot/ui-keyring';

export const ImportViaJSONAccountModal: FC<TCreateAccountModalProps> = ({ isVisible, onFinish }) => {
  const { rawRpcApi } = useApi();
  const [pair, setPair] = useState<KeyringPair | null>(null);
  const [password, setPassword] = useState<string>('');

  const onUploadChange = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
      if (target && target.result && rawRpcApi) {
        const data = convertToU8a(target.result as ArrayBuffer);
        setPair(keyringFromFile(data, rawRpcApi.genesisHash.toHex()));
      }
    };

    reader.readAsArrayBuffer(file);
  }, [setPair, rawRpcApi]);

  const onRestoreClick = useCallback(() => {
    if (!pair || !password) return;
    try {
      keyring.addPair(pair, password);
    } catch (error) {
      console.error(error);
    }
    onFinish();
  }, [pair, password, onFinish]);

  return (<Modal isVisible={isVisible} isClosable={true} onClose={onFinish}>
    <Content>
      <Heading size='2'>{'Add an account via backup JSON file'}</Heading>
    </Content>
    <InputWrapper>
      <Text size={'m'}>Upload</Text>
      <Text size={'s'} color={'grey-500'}>Click to select or drop the file here</Text>
      <Upload onChange={onUploadChange} />
    </InputWrapper>
    <InputWrapper>
      <Text size={'m'}>Password</Text>
      <Text size={'s'} color={'grey-500'}>The password that was previously used to encrypt this account</Text>
      <PasswordInput placeholder={'Password'}
        onChange={setPassword}
        value={password}
      />
    </InputWrapper>
    <TextStyled
      color='additional-warning-500'
      size='s'
    >
      Consider storing your account in a signer such as a browser extension, hardware device, QR-capable phone wallet (non-connected) or desktop application for optimal account security. Future versions of the web-only interface will drop support for non-external accounts, much like the IPFS version.
    </TextStyled>
    <ButtonWrapper>
      <Button
        disabled={!password || !pair}
        onClick={onRestoreClick}
        role='primary'
        title='Restore'
      />
    </ButtonWrapper>

  </Modal>);
};

const Content = styled.div`
  && h2 {
    margin-bottom: 0;
  }
`;

const InputWrapper = styled.div`
  padding: var(--gap) 0;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--gap);
  row-gap: var(--gap);
`;

const TextStyled = styled(Text)`
  box-sizing: border-box;
  display: flex;
  padding: 8px 16px;
  margin: calc(var(--gap) * 1.5) 0;
  border-radius: 4px;
  background-color: ${AdditionalWarning100};
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
