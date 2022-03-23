import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuctionContextProvider, AuctionContextProps } from './AuctionContext';

type TAuctionProviderProps = {
  url?: string,
  options?: unknown
}
const AuctionSocketProvider: FC<TAuctionProviderProps> = ({ url, children }) => {
  const [socket, setSocket] = useState<Socket | undefined>();

  const connectSocket = useCallback((url) => {
    if (!url) return;
    const socket = io(url, {
      path: '/socket.io',
      transports: ['websocket']
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      setSocket(socket);
    });
  }, []);

  useEffect(() => {
    console.log('try connect socket', url);
    connectSocket(url);
  }, [url, connectSocket]);

  const value = useMemo<AuctionContextProps>(() => ({
    socket
  }), [socket]);

  return (<AuctionContextProvider value={value} >{children}</AuctionContextProvider>);
};

export default AuctionSocketProvider;
