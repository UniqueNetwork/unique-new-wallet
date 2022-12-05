import { useCallback, useContext } from 'react';
import keyring from '@polkadot/ui-keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { KeypairType } from '@polkadot/util-crypto/types';

import { useMessage } from '@app/hooks/useMessage';
import { UnsignedTxPayloadResponse } from '@app/types/Api';

import { getSuri, PairType } from '../utils/seedUtils';
import AccountContext, { AccountSigner } from '../account/AccountContext';

export const useAccounts = () => {
  const { showError } = useMessage();
  const {
    signer,
    accounts,
    selectedAccount,
    isLoading,
    fetchAccountsError,
    changeAccount,
    forgetLocalAccount,
    showSignDialog,
    walletsCenter,
  } = useContext(AccountContext);

  const { connectWallet } = walletsCenter;

  const addLocalAccount = useCallback(
    async (
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

      await connectWallet('keyring');
    },
    [connectWallet],
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

  const restoreJSONAccount = useCallback(
    async (pair: KeyringPair, password: string) => {
      try {
        keyring.addPair(pair, password);
        await connectWallet('keyring');
      } catch (e: any) {
        showError({
          name: 'warning',
          text: e.message || 'An error occurred while restoring your account',
        });
      }
    },
    [connectWallet, showError],
  );

  const signMessage = useCallback(
    async (unsignedTxPayload: UnsignedTxPayloadResponse, accountAddress?: string) => {
      const account = accounts.get(accountAddress || '') || selectedAccount;

      if (!account) {
        throw new Error('Account was not provided');
      }
      if (!unsignedTxPayload) {
        throw new Error('Payload was not found');
      }

      let signature: string | undefined;

      if (account.signerType === AccountSigner.local) {
        const password = await showSignDialog(account);
        signature = await account.sign(unsignedTxPayload, account, { password });
      } else {
        signature = await account.sign(unsignedTxPayload, account);
      }

      if (!signature) {
        throw new Error('Signing failed');
      }

      return signature;
    },
    [accounts, selectedAccount, showSignDialog],
  );

  return {
    accounts,
    addLocalAccount,
    addAccountViaQR,
    changeAccount,
    isLoading,
    fetchAccountsError,
    selectedAccount,
    signer,
    signMessage,
    forgetLocalAccount,
    restoreJSONAccount,
    walletsCenter,
  };
};
