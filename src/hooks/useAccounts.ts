import { useCallback, useContext } from 'react';
import { u8aToHex } from '@polkadot/util';
import keyring from '@polkadot/ui-keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { web3FromSource } from '@polkadot/extension-dapp';
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
    fetchAccounts,
    fetchAccountsError,
    changeAccount,
    forgetLocalAccount,
    showSignDialog,
  } = useContext(AccountContext);

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

      await fetchAccounts();
    },
    [fetchAccounts],
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
        await fetchAccounts();
      } catch (e: any) {
        showError({
          name: 'warning',
          text: e.message || 'An error occurred while restoring your account',
        });
      }
    },
    [fetchAccounts, showError],
  );

  const unlockLocalAccount = useCallback(
    (password: string) => {
      if (!signer) {
        return;
      }

      const signature = keyring.getPair(signer.address);
      signature.unlock(password);

      return signature;
    },
    [signer],
  );

  const signMessage = useCallback(
    async (unsignedTxPayload: UnsignedTxPayloadResponse, accountAddress?: string) => {
      const account =
        accounts.find((acc) => acc.address === accountAddress) || selectedAccount;

      if (!account) {
        throw new Error('Account was not provided');
      }
      if (!unsignedTxPayload) {
        throw new Error('Payload was not found');
      }

      let signature: string | undefined;

      if (account.signerType === AccountSigner.local) {
        const { signerPayloadHex } = unsignedTxPayload;
        const pair = await showSignDialog(account);

        signature = u8aToHex(
          pair.sign(signerPayloadHex, {
            withType: true,
          }),
        );
      } else {
        const injector = await web3FromSource(account.meta.source);
        if (!injector.signer.signPayload) {
          throw new Error('Web3 not available');
        }

        const result = await injector.signer.signPayload(
          unsignedTxPayload?.signerPayloadJSON,
        );

        signature = result.signature;
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
    fetchAccounts,
    fetchAccountsError,
    selectedAccount,
    unlockLocalAccount,
    signer,
    signMessage,
    forgetLocalAccount,
    restoreJSONAccount,
  };
};
