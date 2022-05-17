import React, { FC, useCallback, useState } from 'react';
import { Button, Heading, Modal, Text } from '@unique-nft/ui-kit';
import styled from 'styled-components/macro';
import { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';

import { PasswordInput, Upload } from '@app/components';
import { useApi } from '@app/hooks';

import { TCreateAccountModalProps } from './types';
import { convertToU8a, keyringFromFile } from '../../../utils/jsonUtils';

export const ImportViaJSONAccountModal: FC<TCreateAccountModalProps> = ({
  isVisible,
  onFinish,
}) => {
  const { rawRpcApi } = useApi();
  const [pair, setPair] = useState<KeyringPair | null>(null);
  const [password, setPassword] = useState<string>('');

  const onUploadChange = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
        if (target && target.result && rawRpcApi) {
          const data = convertToU8a(target.result as ArrayBuffer);
          setPair(keyringFromFile(data, rawRpcApi.genesisHash.toHex()));
        }
      };

      reader.readAsArrayBuffer(file);
    },
    [setPair, rawRpcApi],
  );

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
      <Content>
        <Heading size="2">{'Add an account via backup JSON file'}</Heading>
      </Content>
      <InputWrapper>
        <Text size={'m'}>Upload</Text>
        <Text size={'s'} color={'grey-500'}>
          Click to select or drop the file here
        </Text>
        <Upload onChange={onUploadChange} />
      </InputWrapper>
      <InputWrapper>
        <Text size={'m'}>Password</Text>
        <Text size={'s'} color={'grey-500'}>
          The password that was previously used to encrypt this account
        </Text>
        <PasswordInput placeholder={'Password'} value={password} onChange={setPassword} />
      </InputWrapper>
      <TextStyled color="additional-warning-500" size="s">
        Consider storing your account in a signer such as a browser extension, hardware
        device, QR-capable phone wallet (non-connected) or desktop application for optimal
        account security. Future versions of the web-only interface will drop support for
        non-external accounts, much like the IPFS version.
      </TextStyled>
      <ButtonWrapper>
        <Button
          disabled={!password || !pair}
          role="primary"
          title="Restore"
          onClick={onRestoreClick}
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

const InputWrapper = styled.div`
  padding: var(--prop-gap) 0;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--prop-gap);
  row-gap: var(--prop-gap);
`;

const TextStyled = styled(Text)`
  box-sizing: border-box;
  display: flex;
  padding: 8px 16px;
  margin: calc(var(--prop-gap) * 1.5) 0;
  border-radius: 4px;
  background-color: var(--color-additional-warning-100);
  width: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
