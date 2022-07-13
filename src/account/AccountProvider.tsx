import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { KeyringPair } from '@polkadot/keyring/types';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

import { sleep } from '@app/utils';
import { NetworkType } from '@app/types';
import { useAccountBalanceService } from '@app/api';
import { useGraphQlAccountCommonInfo } from '@app/api/graphQL/account';
import { ChainPropertiesContext } from '@app/context';

import { DefaultAccountKey } from './constants';
import { SignModal } from '../components/SignModal/SignModal';
import { Account, AccountProvider, AccountSigner } from './AccountContext';

export const AccountWrapper: FC = ({ children }) => {
  const { chainProperties } = useContext(ChainPropertiesContext);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchAccountsError, setFetchAccountsError] = useState<string | undefined>();
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const { data: balanceAccount } = useAccountBalanceService(selectedAccount?.address);
  const { collectionsTotal, tokensTotal } = useGraphQlAccountCommonInfo(
    selectedAccount?.address,
  );

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

  const initializeExtension = useCallback(async () => {
    let extensions = await web3Enable('unique-minter-wallet');

    if (extensions.length === 0) {
      await sleep(1000);

      extensions = await web3Enable('unique-minter-wallet');

      if (extensions.length === 0) {
        setFetchAccountsError(
          'No extension installed, or the user did not accept the authorization',
        );

        setIsLoading(false);
      }
    }

    return extensions;
  }, []);

  const getExtensionAccounts = useCallback(async () => {
    await initializeExtension();

    return (await web3Accounts()).map((account) => ({
      ...account,
      signerType: AccountSigner.extension,
    })) as Account[];
  }, [initializeExtension]);

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

    return [...extensionAccounts, ...localAccounts].map((account) => ({
      ...account,
      address: keyring.encodeAddress(
        keyring.decodeAddress(account.address),
        chainProperties?.SS58Prefix,
      ),
    }));
  }, [chainProperties?.SS58Prefix, getExtensionAccounts, getLocalAccounts]);

  const fetchAccounts = useCallback(async () => {
    const allAccounts = await getAccounts();

    if (allAccounts?.length) {
      setAccounts(allAccounts);
    } else {
      setFetchAccountsError('No accounts in extension');
    }
    setIsLoading(false);
  }, [getAccounts, setAccounts, setFetchAccountsError, setIsLoading]);

  const forgetLocalAccount = useCallback(
    async (forgetAddress: string) => {
      keyring.forgetAccount(forgetAddress);
      const accounts = await getAccounts();
      setAccounts(accounts);
    },
    [getAccounts],
  );

  useEffect(() => {
    if (accounts?.length) {
      const defaultAccountAddress = localStorage.getItem(DefaultAccountKey);

      const defaultAccount = accounts.find(
        (item) => item.address === defaultAccountAddress,
      );

      changeAccount(defaultAccount ?? accounts[0]);
    }
  }, [accounts, changeAccount]);

  const value = useMemo(
    () => ({
      isLoading,
      accounts,
      selectedAccount: selectedAccount
        ? {
            ...selectedAccount,
            tokensTotal,
            collectionsTotal,
            balance: balanceAccount,
            unitBalance: (balanceAccount?.availableBalance.unit as NetworkType) ?? '',
          }
        : undefined,
      forgetLocalAccount,
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
      collectionsTotal,
      tokensTotal,
      balanceAccount,
      forgetLocalAccount,
      fetchAccounts,
      fetchAccountsError,
      changeAccount,
      showSignDialog,
    ],
  );

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
