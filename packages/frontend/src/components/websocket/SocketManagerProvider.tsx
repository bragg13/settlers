import SocketManager from './SocketManager';
import { socketReducer } from './SocketReducer';
import React, { createContext, useReducer, useEffect } from 'react';
import { socketInitialState } from './SocketState';

const socketManager = new SocketManager();

export const SocketManagerContext = createContext<SocketManager>(socketManager);

type ProviderProps = {
  children: React.ReactNode;
};

export function SocketManagerProvider({
  children,
}: ProviderProps): JSX.Element {
  const [socketState, socketStateDispatch] = useReducer(
    socketReducer,
    socketInitialState
  );
  useEffect(() => {
    socketManager.socketStateDispatch = socketStateDispatch;
    socketManager.socketState = socketState;
  }, [socketState]);

  return (
    <SocketManagerContext.Provider value={socketManager}>
      {children}
    </SocketManagerContext.Provider>
  );
}
