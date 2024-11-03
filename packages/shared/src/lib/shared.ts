export function shared(): string {
  return 'shared';
}

import { SocketExceptions } from './server/SocketExceptions';
import { ServerEvents } from './server/ServerEvents';
import { ServerPayloads } from './server/ServerPayloads';

import { ClientEvents } from './client/ClientEvents';
import { ClientPayloads } from './client/ClientPayloads';
import { ServerExceptionResponse } from './server/types';

export {
  SocketExceptions,
  ServerEvents,
  type ServerPayloads,
  ClientEvents,
  type ClientPayloads,
  type ServerExceptionResponse,
};
