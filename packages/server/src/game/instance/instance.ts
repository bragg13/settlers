import { ServerEvents, ServerPayloads } from '@settlers/shared';
import { Lobby } from '../lobby/lobby';
import { AuthenticatedSocket } from '../types';

export class Instance {
  // partita
  public hasStarted = false;
  public hasEnded = false;
  public isPaused = false;
  public currentRound = 0;
  public currentPlayerIndex = 0;

  constructor(public readonly lobby: Lobby) {}

  private getSocketIdFromUsername = (username: string): string => {
    let socketId = '';
    // this is probably slow
    this.lobby.clients.forEach((client) => {
      if (client.data.username === username) {
        socketId = client.id;
      }
    });
    return socketId;
  };

  public triggerStartGame(): void {
    this.hasStarted = true;

    this.lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
      ServerEvents.GameMessage,
      {
        color: 'green',
        message: 'Game started',
      }
    );
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
}
