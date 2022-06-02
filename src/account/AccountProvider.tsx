import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { KeyringPair } from '@polkadot/keyring/types';

import { Account, AccountProvider } from './AccountContext';
import { SignModal } from '../components/SignModal/SignModal';
import { DefaultAccountKey } from './constants';

export const AccountWrapper: FC = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchAccountsError, setFetchAccountsError] = useState<string | undefined>();
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  const changeAccount = useCallback((account: Account) => {
    localStorage.setItem(DefaultAccountKey, account.address);

    setSelectedAccount(account);
  }, []);

  const [isSignModalVisible, setIsSignModalVisible] = useState<boolean>(false);
  const onSignCallback = useRef<(signature?: KeyringPair) => void | undefined>();
  const showSignDialog = useCallback(() => {
    setIsSignModalVisible(true);
    return new Promise<KeyringPair>((resolve, reject) => {
      onSignCallback.current = (signature?: KeyringPair) => {
        if (signature) {
          resolve(signature);
        } else {
          reject(new Error('Signing failed'));
        }
      };
    });
  }, []);

  const onClose = useCallback(() => {
    setIsSignModalVisible(false);
    onSignCallback.current && onSignCallback.current(undefined);
  }, []);

  const onSignFinish = useCallback((signature: KeyringPair) => {
    setIsSignModalVisible(false);
    onSignCallback.current && onSignCallback.current(signature);
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      accounts,
      selectedAccount,
      fetchAccountsError,
      changeAccount,
      setSelectedAccount,
      setFetchAccountsError,
      setAccounts,
      setIsLoading,
      showSignDialog,
    }),
    [
      isLoading,
      accounts,
      selectedAccount,
      fetchAccountsError,
      changeAccount,
      showSignDialog,
    ],
  );

  return (
    <AccountProvider value={value}>
      {children}
      <SignModal
        isVisible={isSignModalVisible}
        onClose={onClose}
        onFinish={onSignFinish}
      />
    </AccountProvider>
  );
};
