export function shared(): string {
  return 'shared';
}

// server
import { SocketExceptions } from './server/SocketExceptions';
import { ServerEvents } from './server/ServerEvents';
import { ServerPayloads } from './server/ServerPayloads';
import { ServerActionPayloads } from './server/ServerActionPayloads';

// client
import { ClientEvents } from './client/ClientEvents';
import { ClientPayloads } from './client/ClientPayloads';
import { ServerExceptionResponse } from './server/types';

// common
import {
  SettlementType,
  Resource,
  Road,
  Spot,
  Tile,
  Owner,
} from './common/BoardTypes';

import { State, GameAction } from './common/GameStates';

export {
  // server
  SocketExceptions,
  ServerEvents,
  type ServerPayloads,
  type ServerActionPayloads,
  type ServerExceptionResponse,

  // client
  ClientEvents,
  type ClientPayloads,

  // common
  type SettlementType,
  Resource,
  type Road,
  type Spot,
  type Tile,
  type Owner,
  type State,
  GameAction,
};
