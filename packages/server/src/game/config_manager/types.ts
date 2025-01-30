import { Player, State } from '@settlers/shared';

export interface GameConfiguration {
  map_board: MapBoardConfiguration | null;
  instance: InstanceConfiguration;
  turn_system: TurnSystemConfiguration;
  game_fsm: GameFSMConfiguration;
  players: Player[];
}

// it's easier to save/load everything as a string with JSON.stringify
export interface MapBoardConfiguration {
  spots: string;
  tiles: string;
  roads: string;
  // deltas: string;
}

export interface InstanceConfiguration {
  hasStarted: boolean;
  hasEnded: boolean;
  isPaused: boolean;
}

export interface TurnSystemConfiguration {
  currentPlayerIndex: number;
  currentRound: number;
}

export interface GameFSMConfiguration {
  state: State;
  setupSteps: number[];
}
