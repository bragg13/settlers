import { Socket } from 'socket.io';
import { Lobby } from './lobby/lobby';
import { ServerEvents } from '@settlers/shared';

export type AuthenticatedSocket = Socket & {
  data: {
    lobby: null | Lobby;
    username: string;
    color: string;
  };

  emit: <T>(ev: ServerEvents, data: T) => boolean;
};
