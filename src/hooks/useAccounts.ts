import { useCallback, useContext, useEffect } from 'react';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
import { KeypairType } from '@polkadot/util-crypto/types';

import { sleep } from '@app/utils';
import { DefaultAccountKey } from '@app/account/constants';
import { SignerPayloadJSONDto } from '@app/types/Api';

import { getSuri, PairType } from '../utils/seedUtils';
import AccountContext, { Account, AccountSigner } from '../account/AccountContext';

export const useAccounts = () => {
  const {
    accounts,
    selectedAccount,
    isLoading,
    fetchAccountsError,
    changeAccount,
    setSelectedAccount,
    setAccounts,
    setIsLoading,
    setFetchAccountsError,
  } = useContext(AccountContext);

  // TODO: move fetching accounts and balances into context

  // const [fetchAccountsError, setFetchAccountsError] = useState<string>();
  // const [isLoading, setIsLoading] = useState(false);
  // const [accounts, setAccounts] = useState<Account[]>();
  // const [selectedAccount, setSelectedAccount] = useState<Account>();

  // const changeAccount = useCallback((account: Account) => {
  //   setSelectedAccount(account);
  // }, []);

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

    console.log('allAccounts', allAccounts);

    return allAccounts;
  }, [getExtensionAccounts, getLocalAccounts]);

  const getAccountBalance = useCallback(() => {
    console.log('getAccountBalance');
  }, []);

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
  }, [changeAccount, getAccounts]);

  useEffect(() => {
    const updatedSelectedAccount = accounts?.find(
      (account) => account.address === selectedAccount?.address,
    );

    if (updatedSelectedAccount) {
      setSelectedAccount(updatedSelectedAccount);
    }
  }, [accounts, setSelectedAccount, selectedAccount]);

  const addLocalAccount = useCallback(
    (
      seed: string,
      derivePath: string,
      name: string,
      password: string,
      pairType: PairType,
    ) => {
      const options = {
        genesisHash: '', // rawRpcApi?.genesisHash.toString(),
        isHardware: false,
        name: name.trim(),
        tags: [],
      };

      keyring.addUri(
        getSuri(seed, derivePath, pairType),
        password,
        options,
        pairType as KeypairType,
      );
    },
    [],
  );

  const addAccountViaQR = useCallback(
    (scanned: {
      name: string;
      isAddress: boolean;
      content: string;
      password: string;
      genesisHash: string;
    }) => {
      const { name, isAddress, content, password, genesisHash } = scanned;

      const meta = {
        // const { mnemonicGenerate } = require('@polkadot/util-crypto');
        genesisHash, // || rawRpcApi?.genesisHash.toHex(),
        name: name?.trim(),
      };
      if (isAddress) keyring.addExternal(content, meta);
      else keyring.addUri(content, password, meta, 'sr25519');
    },
    [],
  );

  const unlockLocalAccount = useCallback(
    (password: string) => {
      if (!selectedAccount) return;
      const signature = keyring.getPair(selectedAccount.address);
      signature.unlock(password);
      return signature;
    },
    [selectedAccount],
  );

  /* const signTx = useCallback(
    async (tx: TTransaction, account?: Account): Promise<TTransaction> => {
      const _account = account || selectedAccount;
      if (!_account) throw new Error('Account was not provided');
      let signedTx;
      if (_account.signerType === AccountSigner.local) {
        const signature = await showSignDialog();
        if (signature) {
          signedTx = await tx.signAsync(signature);
        }
      } else {
        const injector = await web3FromSource(_account.meta.source);
        signedTx = await tx.signAsync(_account.address, {
          signer: injector.signer,
        });
      }
      if (!signedTx) throw new Error('Signing failed');
      return signedTx;
    },
    [showSignDialog, selectedAccount],
  ); */

  const signMessage = useCallback(
    async (
      signerPayloadJSON: SignerPayloadJSONDto,
      account?: Account,
    ): Promise<string> => {
      const _account = account || selectedAccount;
      if (!_account) throw new Error('Account was not provided');
      // TODO: добавить проверку на локальные аккаунты. Задача https://cryptousetech.atlassian.net/browse/WMS-914

      const injector = await web3FromSource(_account.meta.source);
      if (!injector.signer.signPayload) throw new Error('Web3 not available');

      const { signature } = await injector.signer.signPayload(signerPayloadJSON);
      if (!signature) throw new Error('Signing failed');
      return signature;
    },
    [selectedAccount],
  );

  return {
    accounts,
    addLocalAccount,
    addAccountViaQR,
    changeAccount,
    isLoading,
    fetchAccounts,
    fetchAccountsError,
    selectedAccount,
    unlockLocalAccount,
    // signTx,
    signMessage,
    // changeAccount,
  };
};
