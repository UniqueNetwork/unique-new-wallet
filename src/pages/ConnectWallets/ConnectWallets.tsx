import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Button, useNotifications } from '@unique-nft/ui-kit';
import { Ethereum } from '@unique-nft/utils/extension';

import { Icon, Modal } from '@app/components';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';
import {
  CreateAccountModal,
  ImportViaJSONAccountModal,
  ImportViaQRCodeAccountModal,
  ImportViaSeedAccountModal,
} from '@app/pages';
import { useAccounts } from '@app/hooks';

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
};

enum AccountModal {
  CREATE = 'create',
  VIA_SEED = 'importViaSeed',
  VIA_JSON = 'importViaJSON',
  VIA_QR = 'importViaQRCode',
}

const dropdownItems = [
  { title: 'Backup JSON file', modal: AccountModal.VIA_JSON },
  { title: 'Seed phrase', modal: AccountModal.VIA_SEED },
  { title: 'QR-code', modal: AccountModal.VIA_QR },
];

export const ConnectWallets = ({ isOpen, onClose }: Props) => {
  const [open, setOpen] = useState<boolean>(() => {
    return isOpen ?? true;
  });
  const [currentModal, setCurrentModal] = useState<AccountModal | undefined>();
  const { walletsCenter } = useAccounts();
  const { error } = useNotifications();

  const onCreateAccountClick = useCallback(() => {
    logUserEvent(UserEvents.CREATE_SUBSTRATE);
    setCurrentModal(AccountModal.CREATE);
  }, []);

  const onChangeAccountsFinish = useCallback(() => {
    setCurrentModal(undefined);
    setOpen(false);
  }, []);

  const handleOpenModal = (modalType: AccountModal) => {
    logUserEvent(UserEvents.ADD_ACCOUNT_VIA);
    setCurrentModal(modalType);
  };

  const handleConnectToMetamask = async () => {
    try {
      await Ethereum.requestAccounts();
      await walletsCenter.connectWallet('metamask');
      setOpen(false);
      onClose?.();
    } catch (e: any) {
      error(e.message);
    }
  };

  const handleConnectToPolkadotExtension = async () => {
    try {
      await walletsCenter.connectWallet('polkadot');
      await walletsCenter.connectWallet('keyring');
      setOpen(false);
      onClose?.();
    } catch (e: any) {
      error(e.message);
    }
  };

  return (
    <>
      <Modal
        isVisible={open}
        title="Connect wallet"
        onClose={() => {
          setOpen(false);
          onClose?.();
        }}
      >
        <p>Create or import an existing one in any suitable way:</p>
        <Buttons>
          <Button
            title="New substrate account"
            role="primary"
            onClick={onCreateAccountClick}
          />
          {dropdownItems.map((button, idx) => (
            <Button
              key={idx}
              title={button.title}
              onClick={() => {
                setOpen(false);
                handleOpenModal(button.modal);
              }}
            />
          ))}
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
  }
`;
