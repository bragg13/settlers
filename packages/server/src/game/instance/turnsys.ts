import { Socket } from 'socket.io';
import { Lobby } from '../lobby/lobby';
import { TurnSystemConfiguration } from '../config_manager/types';

export class TurnSystem {
  private currentPlayerIndex = 0;
  private currentRound = 0;
  public players: Socket['id'][] = [];

  constructor(private readonly lobby: Lobby, config: TurnSystemConfiguration) {
    this.players = Array.from(this.lobby.clients.keys()); // this will be loaded from config
    this.currentRound = config.currentRound;
    this.currentPlayerIndex = config.currentPlayerIndex;
  }

  public getCurrentPlayer(): Socket['id'] {
    return this.players[this.currentPlayerIndex];
  }
  public getCurrentPlayerIndex(): number {
    return this.currentPlayerIndex;
  }
  public getCurrentRound(): number {
    return this.currentRound;
  }

  public nextTurn(): void {
    this.currentPlayerIndex++;
    if (this.currentPlayerIndex >= this.lobby.maxClients) {
      this.currentPlayerIndex = 0;
    }
    this.currentRound++; // TODO well about this...
    this.lobby.dispatchLobbyState();

    console.log(`Player ${this.getCurrentPlayer()} is playing next`);
  }
}
