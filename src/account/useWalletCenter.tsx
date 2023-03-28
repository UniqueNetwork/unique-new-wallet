import { useCallback, useState } from 'react';
import { ChainPropertiesResponse } from '@unique-nft/sdk';
import { useNotifications } from '@unique-nft/ui-kit';

import { PolkadotWallet } from '@app/account/PolkadotWallet';
import { KeyringWallet } from '@app/account/KeyringWallet';
import { MetamaskWallet } from '@app/account/MetamaskWallet';
import { BaseWalletType } from '@app/account/type';

export type ConnectedWalletsName = 'polkadot' | 'keyring' | 'metamask';

const wallets = new Map<
  ConnectedWalletsName,
  typeof PolkadotWallet | typeof KeyringWallet | typeof MetamaskWallet
>([
  ['polkadot', PolkadotWallet],
  ['keyring', KeyringWallet],
  ['metamask', MetamaskWallet],
]);

const extensionSourceLinks = {
  polkadot: 'https://polkadot.js.org/extension/',
  metamask:
    'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ru',
};

export const CONNECTED_WALLET_TYPE = 'connected-wallet-type';

export const useWalletCenter = (chainProperties: ChainPropertiesResponse) => {
  const [connectedWallets, setConnectedWallets] = useState(
    new Map<ConnectedWalletsName, Map<string, BaseWalletType<any>>>([]),
  );

  const { error } = useNotifications();

  const connectWallet = useCallback(
    async (typeWallet: ConnectedWalletsName) => {
      try {
        const wallet = new (wallets.get(typeWallet)!)(chainProperties);
        console.log('typeWallet', typeWallet, wallet);
        const currentWallets = await wallet.getAccounts();
        console.log('currentWallets', currentWallets);

        const connectedWallets =
          localStorage.getItem(CONNECTED_WALLET_TYPE)?.split(';') || [];

        if (!connectedWallets.includes(typeWallet)) {
          connectedWallets.push(typeWallet);
          localStorage.setItem(CONNECTED_WALLET_TYPE, connectedWallets.join(';'));
        }

        setConnectedWallets((prev) => new Map([...prev, [typeWallet, currentWallets]]));
      } catch (e: any) {
        const connectedWallets =
          localStorage.getItem(CONNECTED_WALLET_TYPE)?.split(';') || [];
        if (connectedWallets.includes(typeWallet)) {
          localStorage.setItem(
            CONNECTED_WALLET_TYPE,
            connectedWallets.filter((type) => type !== typeWallet).join(';'),
          );
        }
        if (typeWallet === 'polkadot' || typeWallet === 'metamask') {
          window.open(extensionSourceLinks[typeWallet], '_blank');
        }

        error(e.message);
      }
    },
    [chainProperties],
  );

  return {
    connectWallet,
    connectedWallets,
  } as const;
};
