import { Delta, Road, Spot, State, Tile } from '@settlers/shared';
// import { Socket } from 'socket.io';

export interface GameConfiguration {
  map_board: MapBoardConfiguration | null;
  instance: InstanceConfiguration;
  turn_system: TurnSystemConfiguration;
  game_fsm: GameFSMConfiguration;
}

// it's easier to save/load everything as a string with JSON.stringify
export interface MapBoardConfiguration {
  spots: string;
  tiles: string;
  roads: string;
  deltas: string;
}

export interface InstanceConfiguration {
  hasStarted: boolean;
  hasEnded: boolean;
  isPaused: boolean;
}

export interface TurnSystemConfiguration {
  currentPlayerIndex: number;
  // players: Socket['id'][];
  currentRound: number;
}

export interface GameFSMConfiguration {
  state: State;
  setupSteps: number[];
}
