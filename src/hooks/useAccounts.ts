import { useCallback, useContext } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';
import { KeypairType } from '@polkadot/util-crypto/types';

import { SignerPayloadJSONDto } from '@app/types/Api';

import { getSuri, PairType } from '../utils/seedUtils';
import AccountContext, { Account } from '../account/AccountContext';

export const useAccounts = () => {
  const {
    accounts,
    selectedAccount,
    isLoading,
    fetchAccounts,
    fetchAccountsError,
    changeAccount,
    setAccounts,
    setIsLoading,
    setFetchAccountsError,
  } = useContext(AccountContext);

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

      if (isAddress) {
        keyring.addExternal(content, meta);
      } else {
        keyring.addUri(content, password, meta, 'sr25519');
      }
    },
    [],
  );

  const unlockLocalAccount = useCallback(
    (password: string) => {
      if (!selectedAccount) {
        return;
      }

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
      if (!_account) {
        throw new Error('Account was not provided');
      }
      // TODO: добавить проверку на локальные аккаунты. Задача https://cryptousetech.atlassian.net/browse/WMS-914

      const injector = await web3FromSource(_account.meta.source);
      if (!injector.signer.signPayload) {
        throw new Error('Web3 not available');
      }

      const { signature } = await injector.signer.signPayload(signerPayloadJSON);
      if (!signature) {
        throw new Error('Signing failed');
      }

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
