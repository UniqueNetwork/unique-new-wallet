import { useCallback, useState } from 'react';
import { Button, Dropdown } from '@unique-nft/ui-kit';

import {
  CreateAccountModal,
  ImportViaSeedAccountModal,
  ImportViaJSONAccountModal,
  ImportViaQRCodeAccountModal,
} from '@app/pages';

import './AccountsGroupButton.scss';

enum AccountModal {
  CREATE = 'create',
  VIA_SEED = 'importViaSeed',
  VIA_JSON = 'importViaJSON',
  VIA_QR = 'importViaQRCode',
}

const dropdownItems = [
  { title: 'Seed phrase', modal: AccountModal.VIA_SEED },
  { title: 'Backup JSON file', modal: AccountModal.VIA_JSON },
  { title: 'QR-code', modal: AccountModal.VIA_QR },
];

export const AccountsGroupButton = () => {
  const [currentModal, setCurrentModal] = useState<AccountModal | undefined>();

  const onCreateAccountClick = useCallback(() => {
    setCurrentModal(AccountModal.CREATE);
  }, []);

  const onChangeAccountsFinish = useCallback(() => {
    setCurrentModal(undefined);
  }, []);

  return (
    <div className="btn-container">
      <Button
        title="Create substrate account"
        className="create-account-btn account-group-btn-medium-font"
        onClick={onCreateAccountClick}
      />
      <Dropdown
        options={dropdownItems}
        optionKey="modal"
        value={currentModal}
        optionRender={({ title }: any) => title}
        onChange={({ modal }: any) => setCurrentModal(modal)}
      >
        <Button
          role="primary"
          title="Add account via"
          iconRight={{ color: 'currentColor', name: 'carret-down', size: 16 }}
        />
      </Dropdown>

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
    </div>
  );
};
