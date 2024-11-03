import { AuthenticatedSocket } from '../types';
import { Lobby } from './lobby';
import { Server } from 'socket.io';
import { ServerException } from '../server.exception';
import { SocketExceptions } from '@settlers/shared';

/**
 * LobbyManager class manages game lobbies, handling lobby creation, joining, and cleanup.
 * Responsible for maintaining the state of all active lobbies and managing socket connections.
 */
export class LobbyManager {
  public server: Server;

  private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<
    Lobby['id'],
    Lobby
  >();

  public initialiseSocket(client: AuthenticatedSocket): void {
    client.data.lobby = null;
  }

  public terminateSocket(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);
  }

  public createLobby(lobbyId: string): Lobby {
    const maxClients = 4;
    console.log(lobbyId);
    const lobby = new Lobby(lobbyId, this.server, maxClients);

    // human-readable lobby id to connect to
    this.lobbies.set(lobbyId, lobby);
    return lobby;
  }

  public joinLobby(lobbyId: string, client: AuthenticatedSocket): void {
    let lobby: Lobby = this.lobbies.get(lobbyId);
    console.log(this.lobbies);

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
  // @Cron("*/5 * * * *")
  // private lobbiesCleanup(): void {}
}
