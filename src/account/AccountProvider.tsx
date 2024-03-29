import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import keyring from '@polkadot/ui-keyring';
import amplitude from 'amplitude-js';
import { Address } from '@unique-nft/utils';

import { NetworkType } from '@app/types';
import { useAccountBalanceService } from '@app/api';
import { useGraphQlAccountCommonInfo } from '@app/api/graphQL/account';
import { ChainPropertiesContext } from '@app/context';
import { BaseWalletType } from '@app/account/type';
import {
  CONNECTED_WALLET_TYPE,
  ConnectedWalletsName,
  useWalletCenter,
} from '@app/account/useWalletCenter';
import { useApi } from '@app/hooks';

import { DefaultAccountKey } from './constants';
import { SignModal } from '../components/SignModal/SignModal';
import { Account, AccountProvider, WalletsType } from './AccountContext';

export const AccountWrapper: FC = ({ children }) => {
  const { currentChain } = useApi();
  const { chainProperties } = useContext(ChainPropertiesContext);
  const [accounts, setAccounts] = useState<Map<string, BaseWalletType<WalletsType>>>(
    new Map(),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchAccountsError, setFetchAccountsError] = useState<string | undefined>();
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const [signer, setSigner] = useState<Account>();

  const { data: balanceAccount, refetch: refetchAccount } = useAccountBalanceService(
    selectedAccount?.address,
    currentChain.apiEndpoint,
  );
  const { collectionsTotal, tokensTotal } = useGraphQlAccountCommonInfo(
    selectedAccount?.address,
  );

  const walletsCenter = useWalletCenter(chainProperties);

  useEffect(() => {
    if (selectedAccount) {
      amplitude.getInstance().setUserId(selectedAccount.address);
    }
  }, [selectedAccount]);

  useEffect(() => {
    setAccounts((accounts) => {
      return Array.from(accounts.values()).reduce((acc, account) => {
        if (Address.is.ethereumAddressInAnyForm(account.address)) {
          acc.set(account.address, account);
          return acc;
        }
        const address = Address.normalize.substrateAddress(
          account.address,
          chainProperties.SS58Prefix,
        );
        acc.set(address, { ...account, address });
        return acc;
      }, new Map<string, BaseWalletType<WalletsType>>());
    });

    setSelectedAccount((account) => {
      if (!account || Address.is.ethereumAddressInAnyForm(account.address)) {
        return account;
      }
      const address = Address.normalize.substrateAddress(
        account.address,
        chainProperties.SS58Prefix,
      );
      refetchAccount();
      return { ...account, address };
    });
  }, [chainProperties, refetchAccount]);

  const changeAccount = useCallback(
    (account: Account) => {
      if (selectedAccount?.address === account.address) {
        return;
      }
      localStorage.setItem(DefaultAccountKey, account.normalizedAddress);

      setSelectedAccount(account);
    },
    [selectedAccount?.address],
  );

  const [isSignModalVisible, setIsSignModalVisible] = useState<boolean>(false);

  const onSignCallback = useRef<(password?: string) => void | undefined>();

  const showSignDialog = useCallback((signer: Account) => {
    setSigner(signer);
    setIsSignModalVisible(true);

    return new Promise<string>((resolve, reject) => {
      onSignCallback.current = (password?: string) => {
        if (password) {
          resolve(password);
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

  const onSignFinish = useCallback((password: string) => {
    setIsSignModalVisible(false);
    onSignCallback.current && onSignCallback.current(password);
  }, []);

  const forgetLocalAccount = useCallback(
    async (forgetAddress: string) => {
      keyring.forgetAccount(forgetAddress);
      setIsLoading(true);
      await walletsCenter.connectWallet('keyring');
      setIsLoading(false);
    },
    [walletsCenter],
  );

  useEffect(() => {
    if (!accounts?.size || isLoading) {
      return;
    }

    const defaultAccountAddress = localStorage.getItem(DefaultAccountKey) || '';

    const defaultAccount = accounts.get(defaultAccountAddress);

    const [firstAccount] = accounts.keys();
    const account = accounts.get(firstAccount);
    const selectedAccount = defaultAccount ?? account;
    if (selectedAccount) {
      changeAccount(selectedAccount);
    }
  }, [accounts, changeAccount, isLoading]);

  useEffect(() => {
    const map = new Map();

    for (const value of walletsCenter.connectedWallets.values()) {
      value.forEach((w) => {
        map.set(w.normalizedAddress, w);
      });
    }

    setAccounts(map);
  }, [walletsCenter.connectedWallets]);

  useEffect(() => {
    const getConnectedWallets = localStorage.getItem(CONNECTED_WALLET_TYPE);
    if (!getConnectedWallets) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const wallets = getConnectedWallets.split(';') as ConnectedWalletsName[];
    const connectedWallets = wallets.map((typeWallet) =>
      walletsCenter.connectWallet(typeWallet),
    );
    if (!connectedWallets.length) {
      setIsLoading(false);
      return;
    }

    Promise.allSettled(connectedWallets).finally(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      setSelectedAccount(() => ({
        ...selectedAccount,
        tokensTotal: tokensTotal ?? 0,
        collectionsTotal: collectionsTotal ?? 0,
        balance: balanceAccount,
        unitBalance: (balanceAccount?.availableBalance.unit as NetworkType) ?? '',
      }));
    }
  }, [tokensTotal, collectionsTotal, balanceAccount]);

  const value = useMemo(
    () => ({
      isLoading,
      signer,
      accounts,
      selectedAccount,
      forgetLocalAccount,
      fetchAccountsError,
      changeAccount,
      setFetchAccountsError,
      setIsLoading,
      showSignDialog,
      walletsCenter,
    }),
    [
      isLoading,
      signer,
      accounts,
      selectedAccount,
      forgetLocalAccount,
      fetchAccountsError,
      changeAccount,
      showSignDialog,
      walletsCenter,
    ],
  );

  return (
    // @ts-ignore
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
