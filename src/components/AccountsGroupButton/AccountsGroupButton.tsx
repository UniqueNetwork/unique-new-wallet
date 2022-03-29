import { Button } from '@unique-nft/ui-kit';
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu/DropdownMenu';
import React, { useCallback, useState } from 'react';
import { CreateAccountModal } from '../../pages/Accounts/Modals/CreateAccount';
import { ImportViaSeedAccountModal } from '../../pages/Accounts/Modals/ImportViaSeed';
import { ImportViaJSONAccountModal } from '../../pages/Accounts/Modals/ImportViaJson';
import { ImportViaQRCodeAccountModal } from '../../pages/Accounts/Modals/ImportViaQRCode';
import './AccountsGroupButton.scss';

type AccountsGroupButtonProps = {
  onClick: () => Promise<void>;
};

enum AccountModal {
  create,
  importViaSeed,
  importViaJSON,
  importViaQRCode,
  sendFunds
}

export const AccountsGroupButton = ({ onClick }: AccountsGroupButtonProps) => {
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
    onClick();
  }, []);

  return (
    <div className={'btn-container'}>
      <Button
        title={'Create substrate account'}
        onClick={onCreateAccountClick}
        className={'create-account-btn account-group-btn-medium-font'}
      />
      <DropdownMenu
        title={'Add account via'}
        role={'primary'}
        className={'account-group-btn-medium-font'}
      >
        <DropdownMenuItem onClick={onImportViaSeedClick}>
          Seed phrase
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onImportViaJSONClick}>
          Backup JSON file
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onImportViaQRClick}>
          QR-code
        </DropdownMenuItem>
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
