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

  // send available actions to the current player
  public dispatchAvailableActions(): void {
    const currentPlayer: string = this.turns.getCurrentPlayer();
    const availableActions = this.fsm.getAvailableActions(
      this.turns.getCurrentPlayerIndex()
    );
    const state = this.fsm.getState();
    console.log(state);
    console.log(typeof state);
    const data = {
      availableActions,
    };

    // additional data based on the state
    switch (state) {
      case 'SETUP':
        if (availableActions.includes(GameAction.ActionSetupSettlement)) {
          data['availableSpots'] = this.board.getAvailableSpots(currentPlayer);
        } else if (availableActions.includes(GameAction.ActionSetupRoad)) {
          data['availableRoads'] = this.board.getAvailableRoads(currentPlayer);
        }
        break;
    }

    this.lobby.dispatchToCurrentPlayer(ServerEvents.AvailableActions, data);
  }

  // dispatch to all clients
  public dispatchGameState(): void {
    const currentPlayer = this.turns.getCurrentPlayer();
    const gameState = this.fsm.getState();
    console.log(`dispatching game state: ${gameState}`);

    const data = {
      currentPlayer,
      currentRound: this.currentRound,
      gameState: gameState,
    };

    this.lobby.dispatchToLobby(ServerEvents.GameState, data);
  }

  public triggerStartGame(): void {
    // start the game
    this.fsm.setupSteps = new Array(this.lobby.clients.size).fill(0);
    this.hasStarted = true;
    this.turns = new TurnSystem(this.players);

    this.board.initBoard();

    // send a message to the lobby that the game started
    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'green',
        message: 'Game started',
      }
    );

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
  public setupSettlement(
    client: AuthenticatedSocket,
    data: ClientPayloads[GameAction.ActionSetupSettlement]
  ): void {
    const currentPlayerIndex = this.turns.getCurrentPlayerIndex();

    if (
      this.fsm
        .getAvailableActions(currentPlayerIndex)
        .includes(GameAction.ActionSetupSettlement)
    ) {
      this.board.buildSettlement(data.spotId, 'village', client.id);
      this.fsm.setupSteps[currentPlayerIndex]++;
      this.dispatchAvailableActions();
    } else {
      Logger.error('Not available action');
    }

    Logger.log('setupSettlement');
    this.dispatchGameState();
  }

  public setupRoad(client: AuthenticatedSocket, data: any): void {
    Logger.log('setupRoad');
  }
  public diceRoll(client: AuthenticatedSocket, data: any): void {
    Logger.log('diceRoll');
  }
}
