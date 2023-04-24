import { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Ethereum } from '@unique-nft/utils/extension';

import { Icon, Modal, Button } from '@app/components';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import {
  CreateAccountModal,
  ExtensionMissingModal,
  ImportViaJSONAccountModal,
  ImportViaQRCodeAccountModal,
  ImportViaSeedAccountModal,
} from '@app/pages';
import { useAccounts } from '@app/hooks';
import { ConnectWalletModalContext } from '@app/context';

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
};

enum AccountModal {
  CREATE = 'create',
  VIA_SEED = 'importViaSeed',
  VIA_JSON = 'importViaJSON',
  VIA_QR = 'importViaQRCode',
  EXTENSION_MISSING = 'extensionMissing',
}

export const ConnectWallets = ({ isOpen, onClose }: Props) => {
  const { isOpenConnectWalletModal, setIsOpenConnectWalletModal } = useContext(
    ConnectWalletModalContext,
  );
  const [currentModal, setCurrentModal] = useState<AccountModal | undefined>();
  const [missingExtension, setMissingExtension] = useState<'Polkadot' | 'Metamask'>();
  const { walletsCenter } = useAccounts();

  useEffect(() => {
    setIsOpenConnectWalletModal(!!isOpen);
  }, [isOpen]);

  const onCreateAccountClick = useCallback(() => {
    logUserEvent(UserEvents.CREATE_SUBSTRATE);
    setCurrentModal(AccountModal.CREATE);
  }, []);

  const onChangeAccountsFinish = useCallback(() => {
    setCurrentModal(undefined);
    setIsOpenConnectWalletModal(false);
    onClose?.();
  }, []);

  const handleOpenModal = (modalType: AccountModal) => () => {
    logUserEvent(UserEvents.ADD_ACCOUNT_VIA);
    setCurrentModal(modalType);
  };

  const handleConnectToMetamask = async () => {
    try {
      await Ethereum.requestAccounts();
      await walletsCenter.connectWallet('metamask');
      setIsOpenConnectWalletModal(false);
      onClose?.();
    } catch (e: any) {
      setMissingExtension('Metamask');
      setCurrentModal(AccountModal.EXTENSION_MISSING);
    }
  };

  const handleConnectToPolkadotExtension = async () => {
    try {
      await walletsCenter.connectWallet('polkadot');
      await walletsCenter.connectWallet('keyring');
      setIsOpenConnectWalletModal(false);
      onClose?.();
    } catch (e: any) {
      setMissingExtension('Polkadot');
      setCurrentModal(AccountModal.EXTENSION_MISSING);
    }
  };

  return (
    <>
      <Modal
        isVisible={isOpenConnectWalletModal}
        title="Connect wallet"
        onClose={() => {
          setIsOpenConnectWalletModal(false);
          onClose?.();
        }}
      >
        <p>Create or import an existing one in any suitable way:</p>
        <Buttons>
          <Button
            title="Seed phrase"
            role="primary"
            onClick={handleOpenModal(AccountModal.VIA_SEED)}
          />
          <Button title="New substrate account" onClick={onCreateAccountClick} />
          <Button
            title="Backup JSON file"
            onClick={handleOpenModal(AccountModal.VIA_JSON)}
          />
        </Buttons>

        <p>You can also create or connect wallets via these providers:</p>
        <Wallets>
          <WalletItem onClick={handleConnectToPolkadotExtension}>
            <Icon size={40} name="polkadot-wallet" /> <span>Polkadot.js</span>
          </WalletItem>
          <WalletItem onClick={handleConnectToMetamask}>
            <Icon size={40} name="metamask-wallet" /> <span>Metamask</span>
          </WalletItem>
        </Wallets>
      </Modal>

      <CreateAccountModal
        isVisible={currentModal === AccountModal.CREATE}
        onFinish={onChangeAccountsFinish}
      />
      <ImportViaSeedAccountModal
        isVisible={currentModal === AccountModal.VIA_SEED}
        onFinish={onChangeAccountsFinish}
      />
      <ImportViaJSONAccountModal
        isVisible={currentModal === AccountModal.VIA_JSON}
        onFinish={onChangeAccountsFinish}
      />
      <ImportViaQRCodeAccountModal
        isVisible={currentModal === AccountModal.VIA_QR}
        onFinish={onChangeAccountsFinish}
      />
      <ExtensionMissingModal
        isVisible={currentModal === AccountModal.EXTENSION_MISSING}
        missingExtension={missingExtension}
        onFinish={() => setCurrentModal(undefined)}
      />
    </>
  );
};

const Wallets = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: var(--prop-gap);
  gap: calc(var(--prop-gap) / 2);
`;

const WalletItem = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-grey-100);
  box-sizing: border-box;
  padding: 11px 27px;
  flex: 1 1 auto;
  cursor: pointer;
  border-radius: calc(var(--prop-gap) / 2);

  span {
    margin-left: 10px;
    font-size: 18px;
    font-weight: 500;
    color: var(--color-additional-dark);
  }
`;

const Buttons = styled.div`
  margin: var(--prop-gap) 0 calc(var(--prop-gap) * 2);
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--prop-gap) / 2);

  & > button {
    flex: 1 1 calc(50% - 10px);
    &:first-child {
      flex: 1 1 100%;
    }
  }
`;
