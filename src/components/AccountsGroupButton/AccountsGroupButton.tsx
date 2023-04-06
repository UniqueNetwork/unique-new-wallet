import { useCallback, useState, VFC } from 'react';
import classNames from 'classnames';

import {
  CreateAccountModal,
  ImportViaJSONAccountModal,
  ImportViaQRCodeAccountModal,
  ImportViaSeedAccountModal,
} from '@app/pages';
import './AccountsGroupButton.scss';
import { logUserEvent, UserEvents } from '@app/utils/logUserEvent';

import { Button } from '../Button';
import { Dropdown } from '../Dropdown';

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

export const AccountsGroupButton: VFC<{ className?: string }> = ({ className }) => {
  const [currentModal, setCurrentModal] = useState<AccountModal | undefined>();

  const onCreateAccountClick = useCallback(() => {
    logUserEvent(UserEvents.CREATE_SUBSTRATE);
    setCurrentModal(AccountModal.CREATE);
  }, []);

  const onChangeAccountsFinish = useCallback(() => {
    setCurrentModal(undefined);
  }, []);

  return (
    <div className={classNames('btn-container', className)}>
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
        onChange={({ modal }: any) => {
          logUserEvent(UserEvents.ADD_ACCOUNT_VIA);
          setCurrentModal(modal);
        }}
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
