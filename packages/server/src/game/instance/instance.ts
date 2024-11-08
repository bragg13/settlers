import {
  ClientPayloads,
  GameAction,
  ServerEvents,
  ServerPayloads,
} from '@settlers/shared';
import { Lobby } from '../lobby/lobby';
import { AuthenticatedSocket } from '../types';
import { MapBoard } from '../map/map.board';
import { GameFSM } from './gamefsm';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { TurnSystem } from './turnsys';

export class Instance {
  // partita
  public hasStarted = false;
  public hasEnded = false;
  public isPaused = false;
  public currentRound = 0;
  private board: MapBoard = new MapBoard();
  private fsm: GameFSM = new GameFSM();
  public players: Socket['id'][] = [];
  public turns: TurnSystem;

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
  public triggerStartGame(): void {
    // start the game
    this.fsm.setupSteps = new Array(this.lobby.clients.size).fill(0);
    this.hasStarted = true;
    this.turns = new TurnSystem(this.lobby);

    this.board.initBoard();

    // send the board tiles somehow

    // send available actions to the current player
    this.dispatchAvailableActions();
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
      this.board.buildSettlement(data.spotId, 'village', client.id);
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
      this.board.buildRoad(data.spot1, data.spot2, client.id);
      this.fsm.setupSteps[currentPlayerIndex]++;
      this.turns.nextTurn();
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
}

// public getUsernameFromSocketId(socketId: Socket['id']): string {
//   return Array.from(this.lobby.clients.values()).filter(
//     (client) => client.id == socketId
//   )[0].data.username;
// }
