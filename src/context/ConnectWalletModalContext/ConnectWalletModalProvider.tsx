import { FC, useMemo, useState } from 'react';

import { CONNECTED_WALLET_TYPE } from '@app/account/useWalletCenter';

import { ConnectWalletModalContext } from './ConnectWalletModalContext';

const getConnectedWallets = localStorage.getItem(CONNECTED_WALLET_TYPE);

export const ConnectWalletModalProvider: FC = ({ children }) => {
  const [isOpenConnectWalletModal, setIsOpenConnectWalletModal] = useState<boolean>(
    !getConnectedWallets || getConnectedWallets.split(';').length === 0,
  );

  return (
    <ConnectWalletModalContext.Provider
      value={useMemo(
        () => ({
          isOpenConnectWalletModal,
          setIsOpenConnectWalletModal,
        }),
        [isOpenConnectWalletModal],
      )}
    >
      {children}
    </ConnectWalletModalContext.Provider>
  );
};
