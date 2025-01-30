import { Instance } from '../instance/instance';
import { GameConfiguration } from './types';
import * as fs from 'fs';
import * as path from 'path';

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
      players: null,
    };
  }

  public static loadConfigurationFromFile(path: string): GameConfiguration {
    const file = fs.readFileSync(path, 'utf8');
    const parsed = JSON.parse(file);
    const data: GameConfiguration = {
      map_board: {
        spots: JSON.parse(parsed.map_board.spots),
        tiles: JSON.parse(parsed.map_board.tiles),
        roads: JSON.parse(parsed.map_board.roads),
      },
      instance: parsed.instance,
      turn_system: parsed.turn_system,
      game_fsm: parsed.game_fsm,
      players: parsed.players,
    };

    return data;
  }

  // i dont really like this tbh
  public static saveConfigToFile(instance: Instance) {
    const config: GameConfiguration = {
      map_board: {
        spots: JSON.stringify(instance.getBoard().spots),
        tiles: JSON.stringify(instance.getBoard().tiles),
        roads: JSON.stringify(instance.getBoard().roads),
        // deltas: JSON.stringify(instance.)
      },
      instance: {
        hasStarted: instance.hasStarted,
        hasEnded: instance.hasEnded,
        isPaused: instance.isPaused,
      },
      turn_system: {
        currentPlayerIndex: instance.turns.getCurrentPlayerIndex(),
        currentRound: instance.turns.getCurrentRound(),
      },
      game_fsm: {
        state: instance.fsm.getState(),
        setupSteps: [...instance.fsm.setupSteps],
      },
      players: Array.from(instance.lobby.clients.values()).map((client) => ({
        username: client.data.username,
        color: client.data.color,
        socketId: client.id,
      })),
    };
    const stringified = JSON.stringify(config);

    // save to file here - rn i dont need to send it to the player, it's debug purposes
    const filePath = path.join(
      '/Users/andrea/Desktop/settlers/saves/',
      `game${instance.lobby.id}.json`
    );
    fs.writeFileSync(filePath, stringified, 'utf8');

    // boilerplate to send it back with websockets to the player
    // if (instance.socket) {
    //     instance.socket.emit('saveGame', {
    //         config: stringified,
    //         filePath: filePath
    //     });
    // }
  }
}
