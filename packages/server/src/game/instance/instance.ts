import {
  ClientPayloads,
  GameAction,
  ServerEvents,
  ServerPayloads,
  State,
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
    const availableActions: ServerPayloads[ServerEvents.AvailableActions] = {};
    this.lobby.dispatchToCurrentPlayer(
      ServerEvents.AvailableActions,
      availableActions
    );
  }

  // dispatch updates to all clients
  // questo va chiamato spesso all'interno di un singolo turnO
  public dispatchDeltaUpdate(): void {
    const updates: ServerPayloads[ServerEvents.DeltaUpdate] = {};
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
    this.turns = new TurnSystem(Array.from(this.lobby.clients.keys()));

    this.board.initBoard();

    // send the initial game state to all clients
    this.dispatchGameState();

    // send available actions to the current player
    this.dispatchAvailableActions();
  }

  public triggerPlayerDisconnect(client: AuthenticatedSocket): void {
    // se il giocatore che si è disconnesso è il giocatore corrente
    // if (client.id === this.lobby.instance.currentPlayerIndex) {
    //   // passa il turno al prossimo giocatore
    //   this.lobby.instance.currentPlayerIndex++;
    // }
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
    // this can probably become some kind of decorator
    }
    const currentPlayerIndex = this.turns.getCurrentPlayerIndex();
    const availableActions = this.fsm.getAvailableActions(currentPlayerIndex);

    // check that the action is legit from this state
    if (availableActions.includes(GameAction.ActionSetupSettlement)) {
      this.board.buildSettlement(data.spotId, 'village', client.id);
      Logger.log('building settlement');
      this.fsm.setupSteps[currentPlayerIndex]++;
      this.dispatchAvailableActions();
      this.dispatchGameState();
    } else {
      Logger.error('Not available action');
    }
  }

  public setupRoad(
    client: AuthenticatedSocket,
    data: ClientPayloads[GameAction.ActionSetupRoad]
  ): void {
    // this can probably become some kind of decorator
    if (client.id !== this.turns.getCurrentPlayer()) {
      const warningMessage: ServerPayloads[ServerEvents.GameMessage] = {
        color: 'red',
        message: 'this is not your turn!',
      };
      this.lobby.dispatchToPlayer(
        client.id,
        ServerEvents.GameMessage,
        warningMessage
      );
      return;
    }
    const currentPlayerIndex = this.turns.getCurrentPlayerIndex();
    const availableActions = this.fsm.getAvailableActions(currentPlayerIndex);

    // check that the action is legit from this state
    if (availableActions.includes(GameAction.ActionSetupRoad)) {
      this.board.buildRoad(data.spot1, data.spot2, client.id);
      Logger.log('building settlement');
      this.fsm.setupSteps[currentPlayerIndex]++;
      console.log(this.fsm.setupSteps[currentPlayerIndex]++);
      this.dispatchAvailableActions();
      this.dispatchGameState();
    } else {
      Logger.error('Not available action');
    }
  }
  public diceRoll(client: AuthenticatedSocket, data: any): void {
    Logger.log('diceRoll');
  }
}

// public getUsernameFromSocketId(socketId: Socket['id']): string {
//   return Array.from(this.lobby.clients.values()).filter(
//     (client) => client.id == socketId
//   )[0].data.username;
// }
