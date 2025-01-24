import { Socket } from 'socket.io';
import { Lobby } from './lobby/lobby';
import { Delta, Road, ServerEvents, Spot, State, Tile } from '@settlers/shared';
import { TurnSystem } from './instance/turnsys';
import { MapBoard } from './map/map.board';
import { Instance } from './instance/instance';

export type AuthenticatedSocket = Socket & {
  data: {
    lobby: null | Lobby;
    username: string;
    color: string;
  };

  emit: <T>(ev: ServerEvents, data: T) => boolean;
};
export interface GameConfiguration {
  map_board: {
    spots: Map<Spot['id'], Spot>;
    tiles: Map<Tile['id'], Tile>;
    roads: Map<Road['id'], Road>;
    deltas: Delta[];
    roadsGraph: {
      [from: Spot['id']]: {
        [to: Spot['id']]: Road['id'];
      };
    };
  };
  instance: {
    currentRound: number;
    hasStarted: boolean;
    hasEnded: boolean;
    isPaused: boolean;
  };
  // players - should not need it
  turn_system: {
    currentPlayerIndex: number;
    currentRound: number; // !!!!!!
    // players
  };
  game_fsm: {
    state: State;
    setupSteps: number[];
  };
}
