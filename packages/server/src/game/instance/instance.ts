import { ClientEvents, ClientPayloads, ServerEvents, ServerPayloads } from '@settlers/shared';
import { Lobby } from '../lobby/lobby';
import { AuthenticatedSocket } from '../types';
import { MapBoard } from '../map/map.board';
import { GameFSM } from './gamefsm';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

export class Instance {
  // partita
  public hasStarted = false;
  public hasEnded = false;
  public isPaused = false;
  public currentRound = 0;
  public currentPlayerIndex = 0;
  private board: MapBoard = new MapBoard();
  private fsm: GameFSM = new GameFSM();
  public players: Socket['id'][] = [];

  constructor(public readonly lobby: Lobby) {}

  public getCurrentPlayer(): Socket['id'] {
    return this.players[this.currentPlayerIndex];
  }

  public nextTurn(): void {
    this.currentPlayerIndex++;
    if (this.currentPlayerIndex >= this.lobby.clients.size) {
      this.currentPlayerIndex = 0;
    }
    this.currentRound++;

    console.log(`Player ${this.getCurrentPlayer()} is playing next`);
  }

  // send available actions to the current player
  public currentPlayerGameState(): void {
    const currentPlayer = this.getCurrentPlayer();
    const availableActions = this.fsm.getAvailableActions();
    this.lobby.dispatchToCurrentPlayer(ServerEvents.AvailableActions, {
      availableActions,
      availableRoads: this.board.getAvailableRoads(currentPlayer),
      availableSpots: this.board.getAvailableSpots(currentPlayer),
    });
  }

  // dispatch to all clients
  public dispatchGameState(): void {
    const currentPlayer = this.getCurrentPlayer();
    const gameState = this.fsm.getState();
    console.log(`dispatching game state: ${gameState}`)

    let data: ServerPayloads[typeof gameState] = {
      currentPlayer,
      currentRound: this.currentRound,
      gameState: gameState,
    };

    if (gameState === ) {
    }

    this.lobby.dispatchToLobby(ServerEvents.GameState, data);
  }

  public triggerStartGame(): void {
    // start the game
    this.hasStarted = true;
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
    this.currentPlayerGameState()
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
  public setupSettlement(client: AuthenticatedSocket, data: ClientPayloads[ClientEvents.ActionSetupSettlement]): void {
    if (this.fsm.getAvailableActions().includes(ClientEvents.ActionSetupSettlement))
    this.fsm.handleAction(, data)

    Logger.log('setupSettlement');
  }
  public setupRoad(client: AuthenticatedSocket, data: any): void {
    Logger.log('setupRoad');
  }
  public diceRoll(client: AuthenticatedSocket, data: any): void {
    Logger.log('diceRoll');
  }
}
