import { Logger, UsePipes } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import {
  ClientEvents,
  ClientPayloads,
  GameAction,
  ServerEvents,
  ServerPayloads,
} from '@settlers/shared';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from './types';
import { WsValidationPipe } from '../websocket/ws.validation-pipe';
import { LobbyManager } from './lobby/lobby.manager';
import { LobbyJoinDto, SetupRoadDto } from './dto';

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

  checkIsClientTurn(client: AuthenticatedSocket) {
    const currentPlayer = client.data.lobby?.instance.turns.getCurrentPlayer();
    if (client.id !== currentPlayer) {
      const warningMessage: ServerPayloads[ServerEvents.GameMessage] = {
        color: 'red',
        message: "now it's not your turn!",
      };
      client.data.lobby?.dispatchToPlayer(
        client.id,
        ServerEvents.GameMessage,
        warningMessage
      );
      return false;
    }
    return true;
  }

  // lobby
  @SubscribeMessage(ClientEvents.LobbyJoin)
  onLobbyJoin(client: AuthenticatedSocket, data: LobbyJoinDto): void {
    client.data.username = data.username;
    client.data.color = data.color;
    this.lobbyManager.joinLobby(data.lobbyId, client);
  }

  @SubscribeMessage(ClientEvents.LobbyLeave)
  onLobbyLeave(client: AuthenticatedSocket): void {
    client.data.lobby?.removeClient(client);
  }

  // game
  @SubscribeMessage(ClientEvents.SaveGame)
  onSaveGameRequest(client: AuthenticatedSocket): void {
    client.data.lobby?.instance.onSaveGameRequest();
  }
  @SubscribeMessage(ClientEvents.LoadGame)
  onLoadGameRequest(
    client: AuthenticatedSocket,
    data: ClientPayloads[ClientEvents.LoadGame]
  ): void {
    // trigger the game start specifying the path of the save
    // TODO: will have to send the savefile directly I guess
    client.data.lobby?.instance.triggerStartGame(data.path);
  }

  // setup
  @SubscribeMessage(GameAction.ActionSetupSettlement)
  onActionSetupSettlement(
    client: AuthenticatedSocket,
    data: ClientPayloads[GameAction.ActionSetupSettlement]
  ): void {
    if (this.checkIsClientTurn(client)) {
      client.data.lobby?.instance.onSetupSettlement(client, data);
    }
  }

  @SubscribeMessage(GameAction.ActionSetupRoad)
  onActionSetupRoad(
    client: AuthenticatedSocket,
    data: ClientPayloads[GameAction.ActionSetupRoad]
  ): void {
    if (this.checkIsClientTurn(client)) {
      client.data.lobby?.instance.onSetupRoad(client, data);
    }
  }

  // dice roll
  @SubscribeMessage(GameAction.ActionDiceRoll)
  onActionDiceRoll(client: AuthenticatedSocket): void {
    if (this.checkIsClientTurn(client)) {
      client.data.lobby?.instance.onDiceRoll(client);
    }
  }

  @SubscribeMessage(ClientEvents.ChatMessage)
  onChatMessage(
    client: AuthenticatedSocket,
    data: ClientPayloads[ClientEvents.ChatMessage]
  ): void {
    client.data.lobby?.chat.addMessage(client, data.text);
  }
}
