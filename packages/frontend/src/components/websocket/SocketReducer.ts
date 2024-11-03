import { SocketAction, SocketState } from './SocketState';

export function socketReducer(
  state: SocketState,
  action: SocketAction
): SocketState {
  switch (action.type) {
    case 'CONNECT':
      return {
        username: action.payload?.username,
        color: action.payload?.color,
        connected: true,
      };

    case 'DISCONNECT':
      return {
        ...state,
        connected: false,
      };

    default:
      return state;
  }
}
