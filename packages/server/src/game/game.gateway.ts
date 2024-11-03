import { Logger, UsePipes } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { ClientEvents, ServerEvents } from '@settlers/shared';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from './types';
import { WsValidationPipe } from '../websocket/ws.validation-pipe';
import { LobbyManager } from './lobby/lobby.manager';
import { LobbyJoinDto } from './dto';

@UsePipes(new WsValidationPipe())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateway.name, { timestamp: false });

  constructor(private readonly lobbyManager: LobbyManager) {}

  async afterInit(server: Server) {
    this.lobbyManager.server = server;
    this.logger.log('game server initialised');
  }

  // quando un client si connette
  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    this.lobbyManager.initialiseSocket(client as AuthenticatedSocket);
    this.logger.log(`Client connected: ${client.id}`);
  }

  // quando un client si disconnette
  async handleDisconnect(client: AuthenticatedSocket) {
    this.lobbyManager.terminateSocket(client);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(client: AuthenticatedSocket, data: LobbyJoinDto): void {
    client.data.username = data.username;
    client.data.color = data.color;
    console.log(data);
    this.lobbyManager.joinLobby(data.lobbyId, client);
  }

  @SubscribeMessage(ClientEvents.LobbyLeave)
  onLobbyLeave(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);

    client.emit(ServerEvents.GameMessage, {
      color: 'red',
      message: 'Disconnected from lobby ',
    }); // redundant bc of dispatchLobbyState
  }

  // gestire qui gli eventi dal client
  // e passarli a lobby.instance
}
