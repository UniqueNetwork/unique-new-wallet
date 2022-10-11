import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Button } from '@unique-nft/ui-kit';
import { KeyringPair } from '@polkadot/keyring/types';

import { Alert, PasswordInput, Upload } from '@app/components';
import { Modal } from '@app/components/Modal';
import { AdditionalText, LabelText } from '@app/pages/Accounts/Modals/commonComponents';
import { ContentRow } from '@app/pages/components/ModalComponents';
import { convertToU8a, keyringFromFile } from '@app/utils';
import { ChainPropertiesContext } from '@app/context';
import { useAccounts } from '@app/hooks';

import { TCreateAccountModalProps } from './types';

export const ImportViaJSONAccountModal: FC<TCreateAccountModalProps> = ({
  isVisible,
  onFinish,
}) => {
  const [pair, setPair] = useState<KeyringPair | null>(null);
  const [password, setPassword] = useState<string>('');
  const { chainProperties } = useContext(ChainPropertiesContext);
  const { restoreJSONAccount } = useAccounts();

  useEffect(() => {
    if (isVisible) {
      return;
    }
    setPassword('');
    setPair(null);
  }, [isVisible]);

  const onUploadChange = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
        if (target?.result) {
          const data = convertToU8a(target.result as ArrayBuffer);
          setPair(keyringFromFile(data, chainProperties.genesisHash));
        }
      };

      reader.readAsArrayBuffer(file);
    },
    [chainProperties.genesisHash],
  );

  const onRestoreClick = useCallback(async () => {
    if (!pair || !password) {
      return;
    }
    await restoreJSONAccount(pair, password);
    onFinish();
  }, [onFinish, pair, password, restoreJSONAccount]);

  return (
    <Modal
      footerButtons={
        <Button
          disabled={!password || !pair}
          role="primary"
          title="Restore"
          onClick={() => {
            onRestoreClick();
          }}
        />
      }
      isVisible={isVisible}
      title="Add an account via backup JSON file"
      onClose={onFinish}
    >
      <ContentRow>
        <LabelText size="m">Upload</LabelText>
        <AdditionalText size="s" color="grey-500">
          Click to select or drop the file here
        </AdditionalText>
        <Upload onChange={onUploadChange} />
      </ContentRow>
      <ContentRow>
        <LabelText size="m">Password</LabelText>
        <AdditionalText size="s" color="grey-500">
          The password that was previously used to encrypt this account
        </AdditionalText>
        <PasswordInput placeholder="Password" value={password} onChange={setPassword} />
      </ContentRow>
      <ContentRow>
        <Alert type="warning">
          Consider storing your account in a signer such as a browser extension, hardware
          device, QR-capable phone wallet (non-connected) or desktop application for
          optimal account security. Future versions of the web-only interface will drop
          support for non-external accounts, much like the IPFS version.
        </Alert>
      </ContentRow>
    </Modal>
  );
};
