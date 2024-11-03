// idk how good it is to save these info
// in the socket state
export type SocketState = {
  connected: boolean;
  username: string;
  color: string;
};

export type SocketAction = {
  type: 'CONNECT' | 'DISCONNECT';
  payload: {
    username: string;
    color: string;
  };
};

export const socketInitialState: SocketState = {
  connected: false,
  username: '',
  color: '',
};
