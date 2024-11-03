import { SocketAction, socketInitialState, SocketState } from './SocketState';
import { Listener } from './types';
import {
  ServerEvents,
  ServerExceptionResponse,
  ClientEvents,
} from '@settlers/shared';
import { io, Socket } from 'socket.io-client';
import { showNotification } from '@mantine/notifications';

type EmitOptions<T> = {
  event: ClientEvents;
  data?: T;
};

export default class SocketManager {
  public readonly socket: Socket;

  public socketStateDispatch: (action: SocketAction) => void;
  public socketState: SocketState;

  private connectionLost = false;

  constructor() {
    // this.socket = io(process.env.PUBLIC_SOCKET_ENDPOINT as string, {
    this.socket = io('http://localhost:3000');
    this.socketStateDispatch = () => {}; // will be set in SocketManagerProvider
    this.socketState = socketInitialState;

    this.onConnect();
    this.onDisconnect();
    this.onException();
  }

  emit<T>(options: EmitOptions<T>): this {
    this.socket.emit(options.event, options.data);

    return this;
  }

  getSocketId(): string | null | undefined {
    if (!this.socket.connected) {
      return null;
    }

    return this.socket.id;
  }

  connect(): void {
    this.socket.connect();
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  registerListener<T>(event: ServerEvents, listener: Listener<T>): this {
    this.socket.on(event, listener);

    return this;
  }

  removeListener<T>(event: ServerEvents, listener: Listener<T>): this {
    this.socket.off(event, listener);

    return this;
  }

  private onConnect(): void {
    this.socket.on('connect', () => {
      if (this.connectionLost) {
        showNotification({
          message: 'Reconnected to server!',
          color: 'green',
          autoClose: 2000,
        });
        this.connectionLost = false;
      }
    });
  }

  private onDisconnect(): void {
    this.socket.on('disconnect', async (reason: Socket.DisconnectReason) => {
      if (reason === 'io client disconnect') {
        showNotification({
          message: 'Disconnected successfully!',
          color: 'green',
          autoClose: 2000,
        });
      }

      if (reason === 'io server disconnect') {
        showNotification({
          message: 'You got disconnect by server',
          color: 'orange',
          autoClose: 3000,
        });
      }

      if (
        reason === 'ping timeout' ||
        reason === 'transport close' ||
        reason === 'transport error'
      ) {
        showNotification({
          message: 'Connection lost to the server',
          color: 'orange',
          autoClose: 3000,
        });
        this.connectionLost = true;
      }

      if (this.socketStateDispatch) {
        this.socketStateDispatch({
          type: 'DISCONNECT',
        });
      }
    });
  }

  private onException(): void {
    this.socket.on('exception', (data: ServerExceptionResponse) => {
      if (typeof data.exception === 'undefined') {
        showNotification({
          message: 'Unexpected error from server',
          color: 'red',
        });

        return;
      }

      let body = `Error: ${data.exception}`;

      if (data.message) {
        if (typeof data.message === 'string') {
          body += ` | Message: "${data.message}"`;
        } else if (typeof data.message === 'object') {
          body += ` | Message: "${JSON.stringify(data.message)}"`;
        }
      }

      showNotification({
        message: body,
        color: 'red',
      });
    });
  }
}
