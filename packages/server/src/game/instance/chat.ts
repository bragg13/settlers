import { Socket } from 'socket.io';
import { Lobby } from '../lobby/lobby';
import { AuthenticatedSocket } from '../types';
import { ServerEvents, ServerPayloads } from '@settlers/shared';

type Message = {
  creator: Socket['id'];
  text: string;
};

export class Chat {
  private messages: Array<Message> = [];
  constructor(public readonly lobby: Lobby) {}

  addMessage(client: AuthenticatedSocket, text: string): void {
    const message: ServerPayloads[ServerEvents.ChatMessage] = {
      creator: client.id,
      username: client.data.username,
      text,
    };
    this.messages.push(message);
    this.lobby.dispatchToLobby(ServerEvents.ChatMessage, message);
  }
}
