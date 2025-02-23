export function shared(): string {
  return 'shared';
}

// server
import { SocketExceptions } from './server/SocketExceptions';
import { ServerEvents } from './server/ServerEvents';
import { ServerPayloads } from './server/ServerPayloads';

// client
import { GameAction, ClientEvents } from './client/ClientEvents';
import { ClientPayloads } from './client/ClientPayloads';
import { ServerExceptionResponse, Player } from './server/types';

// common
import {
  SettlementType,
  TileResource,
  Road,
  Spot,
  Tile,
  Delta,
} from './common/BoardTypes';

import { State } from './common/GameStates';

export {
  // server
  SocketExceptions,
  ServerEvents,
  type ServerPayloads,
  type ServerExceptionResponse,

  // client
  ClientEvents,
  type ClientPayloads,
  type Player,

  // common
  type SettlementType,
  type TileResource,
  type Road,
  type Spot,
  type Tile,
  type State,
  GameAction,
  type Delta,
};
