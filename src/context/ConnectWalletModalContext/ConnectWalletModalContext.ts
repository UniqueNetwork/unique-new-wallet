import { Context, createContext } from 'react';

export type ConnectWalletModalContextValue = {
  isOpenConnectWalletModal: boolean;
  setIsOpenConnectWalletModal(value: boolean): void;
};

export const ConnectWalletModalContext: Context<ConnectWalletModalContextValue> =
  createContext({} as unknown as ConnectWalletModalContextValue);
