import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../types';
import { Instance } from '../instance/instance';
import { Logger } from '@nestjs/common';
import { ServerPayloads, ServerEvents } from '@settlers/shared';
import { Chat } from '../instance/chat';

/**
 * Class representing a matchmaking lobby
 * can add clients, remove clients, dispatch lobby state
 * and dispatch events to all clients in the lobby
 * has id, creation date, max clients, and a reference to the instance
 * @class
 */
export class Lobby {
  public readonly createdAt: Date = new Date();
  public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<
    Socket['id'],
    AuthenticatedSocket
  >();

  public readonly instance: Instance = new Instance(this);
  public readonly chat: Chat = new Chat(this);

  constructor(
    public readonly id: string,
    private readonly server: Server,
    public readonly maxClients: number
  ) {
    this.id = id;
  }

  public addClient(client: AuthenticatedSocket): void {
    // add client
    this.clients.set(client.id, client);

    // socket joins this lobby
    client.join(this.id);
    client.data.lobby = this;

    // dispatch message to all clients in the lobby
    this.dispatchToLobby(ServerEvents.GameMessage, {
      color: 'green',
      message: `player ${client.data.username} joined the lobby`,
    });

    if (this.clients.size >= this.maxClients) {
      Logger.log(`Lobby ${this.id} is full, starting game...`);
      this.instance.triggerStartGame();
    }

    this.dispatchLobbyState();
  }

  public removeClient(client: AuthenticatedSocket): void {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;

    this.instance.triggerPlayerDisconnect(client);

    this.dispatchToLobby(ServerEvents.GameMessage, {
      color: 'red',
      message: 'player left the lobby',
    });

    this.dispatchLobbyState();
  }

  // questo viene chiamato solo a fine turno
  public dispatchLobbyState(): void {
    const data: ServerPayloads[ServerEvents.LobbyState] = {
      lobbyId: this.id,
      hasStarted: this.instance.hasStarted,
      hasEnded: this.instance.hasEnded,
      currentPlayer: this.instance.turns
        ? this.instance.turns.getCurrentPlayer()
        : null,
      currentRound: this.instance.turns
        ? this.instance.turns.getCurrentRound()
        : null,
      players: Array.from(this.clients.values()).map((client) => ({
        username: client.data.username,
        color: client.data.color,
        socketId: client.id,
      })),
    };

    this.dispatchToLobby(ServerEvents.LobbyState, data);
  }

  public dispatchToLobby<T>(event: string, data: T): void {
    this.server.to(this.id).emit(event, data);
  }

  public dispatchToCurrentPlayer<T>(event: string, data: T): void {
    this.clients.get(this.instance.turns.getCurrentPlayer()).emit(event, data);
  }

  public dispatchToPlayer<T>(
    socketId: Socket['id'],
    event: string,
    data: T
  ): void {
    this.clients.get(socketId).emit(event, data);
  }
}
