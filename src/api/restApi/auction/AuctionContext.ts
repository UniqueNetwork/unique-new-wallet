import { Context, Consumer, Provider, createContext } from 'react';
import { Socket } from 'socket.io-client';

export type AuctionContextProps = {
  socket?: Socket,
}

const AuctionContextContext: Context<AuctionContextProps> = createContext({} as unknown as AuctionContextProps);
const AuctionContextConsumer: Consumer<AuctionContextProps> = AuctionContextContext.Consumer;
const AuctionContextProvider: Provider<AuctionContextProps> = AuctionContextContext.Provider;

export default AuctionContextContext;

export { AuctionContextConsumer, AuctionContextProvider };
