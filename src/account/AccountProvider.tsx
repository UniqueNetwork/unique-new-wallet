import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyringPair } from '@polkadot/keyring/types';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

import { sleep } from '@app/utils';
import { getAccountBalance, IBaseApi } from '@app/api/restApi';
import { useApi } from '@app/hooks';

import { Account, AccountProvider, AccountSigner } from './AccountContext';
import { SignModal } from '../components/SignModal/SignModal';
import { DefaultAccountKey } from './constants';

const AccountWrapper: FC = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [fetchAccountsError, setFetchAccountsError] = useState<string | undefined>();
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const { api } = useApi();
  const apiRef = useRef<IBaseApi>();

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
        if (signature) resolve(signature);
        else reject(new Error('Signing failed'));
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

  const getExtensionAccounts = useCallback(async () => {
    // this call fires up the authorization popup
    let extensions = await web3Enable('unique-minter-wallet');

    if (extensions.length === 0) {
      console.log('Extension not found, retry in 1s');

      await sleep(1000);
      extensions = await web3Enable('my cool dapp');

      if (extensions.length === 0) {
        // alert('no extension installed, or the user did not accept the authorization');
        return [];
      }
    }

    return (await web3Accounts()).map((account) => ({
      ...account,
      signerType: AccountSigner.extension,
    })) as Account[];
  }, []);

  const getLocalAccounts = useCallback(() => {
    const keyringAccounts = keyring.getAccounts();

    return keyringAccounts.map(
      (account) =>
        ({
          address: account.address,
          meta: account.meta,
          signerType: AccountSigner.local,
        } as Account),
    );
  }, []);

  const getAccounts = useCallback(async () => {
    // this call fires up the authorization popup
    const extensionAccounts = await getExtensionAccounts();
    const localAccounts = getLocalAccounts();

    const allAccounts: Account[] = [...extensionAccounts, ...localAccounts];

    return allAccounts;
  }, [getExtensionAccounts, getLocalAccounts]);

  const fetchAccounts = useCallback(async () => {
    // this call fires up the authorization popup
    const extensions = await web3Enable('my cool dapp');

    if (extensions.length === 0) {
      setFetchAccountsError(
        'No extension installed, or the user did not accept the authorization',
      );

      setIsLoading(false);

      return;
    }

    const allAccounts = await getAccounts();

    setAccounts(allAccounts);

    if (allAccounts?.length) {
      const defaultAccountAddress = localStorage.getItem(DefaultAccountKey);

      const defaultAccount = allAccounts.find(
        (item) => item.address === defaultAccountAddress,
      );

      if (defaultAccount) {
        changeAccount(defaultAccount);
      } else {
        changeAccount(allAccounts[0]);
      }
    } else {
      setFetchAccountsError('No accounts in extension');
    }

    setIsLoading(false);
  }, [changeAccount, getAccounts, setAccounts, setFetchAccountsError, setIsLoading]);

  const setSelectedAccountBalance = useCallback(async () => {
    if (selectedAccount) {
      apiRef.current = api;

      setIsLoadingBalance(true);

      const { data } = await getAccountBalance(api!, selectedAccount.address);

      setSelectedAccount({
        ...selectedAccount,
        balance: data?.amount,
      });

      setIsLoadingBalance(false);
    }
  }, [api, selectedAccount]);

  const value = useMemo(
    () => ({
      isLoading,
      accounts,
      selectedAccount,
      fetchAccounts,
      fetchAccountsError,
      changeAccount,
      setFetchAccountsError,
      setAccounts,
      setIsLoading,
      showSignDialog,
    }),
    [
      isLoading,
      accounts,
      selectedAccount,
      fetchAccounts,
      fetchAccountsError,
      changeAccount,
      showSignDialog,
    ],
  );

  useEffect(() => {
    if (apiRef.current !== api) {
      void setSelectedAccountBalance();
    }
  }, [api, setSelectedAccountBalance]);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

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

export default AccountWrapper;
