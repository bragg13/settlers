import { AuthenticatedSocket } from '../types';
import { Lobby } from './lobby';
import { Server } from 'socket.io';
import { ServerException } from '../server.exception';
import {
  ServerEvents,
  ServerPayloads,
  SocketExceptions,
} from '@settlers/shared';
import { Cron } from '@nestjs/schedule';

/**
 * LobbyManager class manages game lobbies, handling lobby creation, joining, and cleanup.
 * Responsible for maintaining the state of all active lobbies and managing socket connections.
 */
export class LobbyManager {
  public server: Server;
  private LOBBY_MAX_LIFETIME = 1000 * 60 * 5; // 5 min

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<
    Lobby['id'],
    Lobby
  >();

  public initialiseSocket(client: AuthenticatedSocket): void {
    client.data.lobby = null;
  }

  public terminateSocket(client: AuthenticatedSocket): void {
    const lobbyid = client.data.lobby?.id;
    client.data.lobby?.removeClient(client);
    this.lobbies.delete(lobbyid);
    console.log('lobbies');
    console.log(this.lobbies);
  }

  public createLobby(lobbyId: string): Lobby {
    const maxClients = 2; // will be 4
    const lobby = new Lobby(lobbyId, this.server, maxClients);

    // human-readable lobby id to connect to
    this.lobbies.set(lobbyId, lobby);
    return lobby;
  }

  public joinLobby(lobbyId: string, client: AuthenticatedSocket): void {
    let lobby: Lobby = this.lobbies.get(lobbyId);

    // che succcede quando succedono le eccezioni?
    if (!lobby) {
      lobby = this.createLobby(lobbyId);
      // throw new ServerException(SocketExceptions.LobbyError, 'lobby not found');
    }
    if (lobby.clients.size >= lobby.maxClients) {
      throw new ServerException(
        SocketExceptions.LobbyError,
        'lobby already full'
      );
    }

    lobby.addClient(client);
  }

  // periodically cleanup lobbies
  @Cron('*/5 * * * *')
  private lobbiesCleanup(): void {
    for (const [lobbyId, lobby] of this.lobbies) {
      const now = new Date().getTime();
      const lobbyCreatedAt = lobby.createdAt.getTime();
      const lobbyLifetime = now - lobbyCreatedAt;

      if (lobbyLifetime > this.LOBBY_MAX_LIFETIME) {
        lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(
          ServerEvents.GameMessage,
          {
            color: 'blue',
            message: 'Game timed out',
          }
        );

        lobby.instance.triggerFinish();

        this.lobbies.delete(lobby.id);
      }
    }
  }
}
