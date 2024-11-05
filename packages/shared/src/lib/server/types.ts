import { Socket } from 'socket.io';
import { SocketExceptions } from './SocketExceptions';

export type ServerExceptionResponse = {
  exception: SocketExceptions;
  message?: string | object;
};

export type Player = {
  username: string;
  color: string;
  socketId: Socket['id'] | null | undefined;
};
