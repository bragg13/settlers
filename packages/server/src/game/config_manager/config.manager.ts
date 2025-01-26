import { GameConfiguration } from './types';

export class ConfigManager {
  public static getEmptyConfiguration(): GameConfiguration {
    return {
      map_board: {
        spots: new Map(),
        tiles: new Map(),
        roads: new Map(),
        deltas: [],
        roadsGraph: {},
      },
      instance: {
        hasStarted: false,
        hasEnded: false,
        isPaused: false,
      },
      turn_system: {
        currentPlayerIndex: 0,
        players: [],
        currentRound: 0,
      },
      game_fsm: {
        state: 'some_state',
        setupSteps: [],
      },
    };
  }

  public static loadConfigurationFromFile(path: string): GameConfiguration {
    return {};
  }

  public static saveConfigToFile() {}
}
