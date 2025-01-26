import { GameConfiguration } from './types';

export class ConfigManager {
  public static getEmptyConfiguration(nplayers: number): GameConfiguration {
    return {
      map_board: null,
      instance: {
        hasStarted: true,
        hasEnded: false,
        isPaused: false,
      },
      turn_system: {
        currentPlayerIndex: 0,
        currentRound: 0,
      },
      game_fsm: {
        state: 'SETUP',
        setupSteps: new Array(nplayers).fill(0),
      },
    };
  }

  public static loadConfigurationFromFile(path: string): GameConfiguration {
    return this.getEmptyConfiguration(4);
  }

  public static saveConfigToFile() {}
}
