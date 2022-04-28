import { Button } from '@unique-nft/ui-kit';
import React, { useCallback, useState } from 'react';

import {
  CreateAccountModal,
  ImportViaSeedAccountModal,
  ImportViaJSONAccountModal,
  ImportViaQRCodeAccountModal,
} from '@app/pages';

import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu/DropdownMenu';
import './AccountsGroupButton.scss';

enum AccountModal {
  create,
  importViaSeed,
  importViaJSON,
  importViaQRCode,
  sendFunds,
}

export const AccountsGroupButton = () => {
  const [currentModal, setCurrentModal] = useState<AccountModal | undefined>();

  const onCreateAccountClick = useCallback(() => {
    setCurrentModal(AccountModal.create);
  }, []);

  const onImportViaSeedClick = useCallback(() => {
    setCurrentModal(AccountModal.importViaSeed);
  }, []);

  const onImportViaJSONClick = useCallback(() => {
    setCurrentModal(AccountModal.importViaJSON);
  }, []);

  const onImportViaQRClick = useCallback(() => {
    setCurrentModal(AccountModal.importViaQRCode);
  }, []);

  const onChangeAccountsFinish = useCallback(() => {
    setCurrentModal(undefined);
  }, []);

  return (
    <div className={'btn-container'}>
      <Button
        title={'Create substrate account'}
        className={'create-account-btn account-group-btn-medium-font'}
        onClick={onCreateAccountClick}
      />
      <DropdownMenu
        title={'Add account via'}
        role={'primary'}
        className={'account-group-btn-medium-font'}
      >
        <DropdownMenuItem onClick={onImportViaSeedClick}>Seed phrase</DropdownMenuItem>
        <DropdownMenuItem onClick={onImportViaJSONClick}>
          Backup JSON file
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onImportViaQRClick}>QR-code</DropdownMenuItem>
      </DropdownMenu>

      <CreateAccountModal
        isVisible={currentModal === AccountModal.create}
        onFinish={onChangeAccountsFinish}
      />
      <ImportViaSeedAccountModal
        isVisible={currentModal === AccountModal.importViaSeed}
        onFinish={onChangeAccountsFinish}
      />
      <ImportViaJSONAccountModal
        isVisible={currentModal === AccountModal.importViaJSON}
        onFinish={onChangeAccountsFinish}
      />
      <ImportViaQRCodeAccountModal
        isVisible={currentModal === AccountModal.importViaQRCode}
        onFinish={onChangeAccountsFinish}
      />
    </div>
  );
};
