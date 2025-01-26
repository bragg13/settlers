import { Delta, Road, Spot, State, Tile } from '@settlers/shared';
// import { Socket } from 'socket.io';

export interface GameConfiguration {
  map_board: MapBoardConfiguration;
  instance: InstanceConfiguration;
  turn_system: TurnSystemConfiguration;
  game_fsm: GameFSMConfiguration;
}

export interface MapBoardConfiguration {
  spots: Map<Spot['id'], Spot>;
  tiles: Map<Tile['id'], Tile>;
  roads: Map<Road['id'], Road>;
  deltas: Delta[];
  roadsGraph: {
    [from: Spot['id']]: {
      [to: Spot['id']]: Road['id'];
    };
  };
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
