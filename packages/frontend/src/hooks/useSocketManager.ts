import { useContext } from 'react';
import { SocketManagerContext } from '../components/websocket/SocketManagerProvider';

export const useSocketManager = () => {
  const sm = useContext(SocketManagerContext);
  return sm;
};
