import {
  ClientPayloads,
  GameAction,
  Player,
  ServerEvents,
  ServerPayloads,
} from '@settlers/shared';
import { Lobby } from '../lobby/lobby';
import { AuthenticatedSocket } from '../types';
import { MapBoard } from '../map/map.board';
import { GameFSM } from './gamefsm';
import { Logger } from '@nestjs/common';
import { TurnSystem } from './turnsys';
import { ConfigManager } from '../config_manager/config.manager';
import { GameConfiguration } from '../config_manager/types';

export class Instance {
  // partita
  public hasStarted = false;
  public hasEnded = false;
  public isPaused = false;
  private board: MapBoard; // TODO private/public?
  public fsm: GameFSM; // TODO private/public?
  public turns: TurnSystem; // TODO private/public?

  constructor(public readonly lobby: Lobby) {}

  /**
   *  dispatching and sending to client(s)
   *
   */

  // send available actions to the current player
  public dispatchAvailableActions(): void {
    const currentPlayerIndex = this.turns.getCurrentPlayerIndex();
    const currentPlayer = this.turns.getCurrentPlayer();
    const availableActions = this.fsm.getAvailableActions(currentPlayerIndex);

    const actions: ServerPayloads[ServerEvents.AvailableActions] = {
      availableActions,
      buildableSpots:
        availableActions.includes(GameAction.ActionSetupSettlement) ||
        availableActions.includes(GameAction.ActionBuildSettlement)
          ? this.board.getAvailableSpots(currentPlayer)
          : null,
      buildableRoads:
        availableActions.includes(GameAction.ActionSetupRoad) ||
        availableActions.includes(GameAction.ActionBuildRoad)
          ? this.board.getAvailableRoads(currentPlayer)
          : null,
      buildableCities: null,
    };

    this.lobby.dispatchToCurrentPlayer(ServerEvents.AvailableActions, actions);
  }

  // dispatch updates to all clients
  // questo va chiamato spesso all'interno di un singolo turnO
  public dispatchDeltaUpdate(): void {
    const updates: ServerPayloads[ServerEvents.DeltaUpdate] =
      this.board.getDeltaUpdates();
    this.lobby.dispatchToLobby(ServerEvents.DeltaUpdate, updates);
  }

  /**
   *  receiving data from the clients
   *
   */
  public triggerStartGame(config_path: string | null = null): void {
    // add some checks if the lobby size is equal to the config size etc.
    // right now, it's free for all lol
    const config: GameConfiguration = config_path
      ? ConfigManager.loadConfigurationFromFile(config_path)
      : ConfigManager.getEmptyConfiguration(this.lobby.clients.size);

    const socketsMapping: {
      [key: AuthenticatedSocket['id']]: AuthenticatedSocket['id'];
    } = {};

    if (config.players) {
      // associate new socketIds with old ones through username
      // TODO: this can result in error if there isnt a match in username
      const players: Player[] = Array.from(this.lobby.clients.values()).map(
        (client) => ({
          username: client.data.username,
          color: client.data.color,
          socketId: client.id,
          resources: { ...client.data.resources },
        })
      );

      for (const old of config.players) {
        const newPlayer: Player = players.find(
          (el) => el.username == old.username
        );
        socketsMapping[old.socketId] = newPlayer.socketId;
      }
    }

    this.turns = new TurnSystem(
      this.lobby, // this is for players, I will have to deal with it later
      config.turn_system
    );

    this.fsm = new GameFSM(config.game_fsm);

    this.board = new MapBoard(config.map_board, socketsMapping);

    this.hasStarted = config.instance.hasStarted;
    this.hasEnded = config.instance.hasEnded;
    this.isPaused = config.instance.isPaused;

    // send available actions to the current player
    this.lobby.dispatchLobbyState();

    for (const player of this.lobby.clients.values()) {
      const playerInfo: Player = {
        resources: {
          WOOD: 0,
          WHEAT: 0,
          SHEEP: 0,
          BRICK: 0,
          ORE: 0,
        },
        username: player.data.username,
        color: player.data.color,
        socketId: player.id,
      };
      this.lobby.dispatchToPlayer(
        player.id,
        ServerEvents.PlayerInformation,
        playerInfo
      );
    }
    this.dispatchAvailableActions();
    console.log(`loaded game from ${config_path}`);
  }

  public getBoard(): {
    spots: string;
    tiles: string;
    roads: string;
  } {
    const data = {
      tiles: JSON.stringify(Object.fromEntries(this.board.tiles)),
      spots: JSON.stringify(Object.fromEntries(this.board.spots)),
      roads: JSON.stringify(Object.fromEntries(this.board.roads)),
    };
    return data;
  }

  public triggerFinish(): void {
    if (!this.hasStarted) {
      return;
    }

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'blue',
        message: 'Game finished !',
      }
    );
  }
  public triggerPlayerDisconnect(client: AuthenticatedSocket): void {
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'red',
        message: `player ${client.data.username} disconnected`,
      }
    );
  }

  // gestire qui la logica del gioco
  // e terminare con this.lobby.dispatchLobbyState per mandare aggionramenti a tutti i client
  public onSetupSettlement(
    client: AuthenticatedSocket,
    data: ClientPayloads[GameAction.ActionSetupSettlement]
  ): void {
    const currentPlayerIndex = this.turns.getCurrentPlayerIndex();
    const availableActions = this.fsm.getAvailableActions(currentPlayerIndex);

    if (availableActions.includes(GameAction.ActionSetupSettlement)) {
      this.board.buildSettlement(
        data.spotId,
        'village',
        client.id,
        GameAction.ActionSetupSettlement
      );
      this.fsm.setupSteps[currentPlayerIndex]++;
      this.dispatchDeltaUpdate();
      this.dispatchAvailableActions();
    } else {
      Logger.error('Not available action');
    }
  }

  public onSetupRoad(
    client: AuthenticatedSocket,
    data: ClientPayloads[GameAction.ActionSetupRoad]
  ): void {
    // this can probably become some kind of decorator
    const currentPlayerIndex = this.turns.getCurrentPlayerIndex();
    const availableActions = this.fsm.getAvailableActions(currentPlayerIndex);

    // check that the action is legit from this state
    if (availableActions.includes(GameAction.ActionSetupRoad)) {
      this.board.buildRoad(
        data.spot1,
        data.spot2,
        client.id,
        GameAction.ActionSetupRoad
      );
      this.fsm.setupSteps[currentPlayerIndex]++;
      this.turns.nextTurn();
      if (this.turns.getCurrentRound() === this.lobby.maxClients * 2) {
        // end of setup stage
        this.fsm.transitionTo('DICE_ROLL');
      }
      this.dispatchAvailableActions();
      this.dispatchDeltaUpdate();
    } else {
      Logger.error('Not available action');
    }
  }
  public onDiceRoll(client: AuthenticatedSocket, data: any): void {
    Logger.log('diceRoll');
    // this.fsm.transitionTo(state) // to turn?
  }

  public onEndTurn(client: AuthenticatedSocket): void {
    const currentPlayerIndex = this.turns.getCurrentPlayerIndex();
    const availableActions = this.fsm.getAvailableActions(currentPlayerIndex);

    // check that the action is legit from this state
    if (availableActions.includes(GameAction.ActionEndTurn)) {
      // this.fsm.transitionTo(state) // to dice roll?
      this.turns.nextTurn();
    }
  }

  // public onBuildRoad() { }
  // public onBuildSettlement() { }

  public onSaveGameRequest() {
    ConfigManager.saveConfigToFile(this);
  }
}
