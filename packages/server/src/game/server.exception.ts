import { WsException } from '@nestjs/websockets';
import { SocketExceptions } from '@settlers/shared';
import { ServerExceptionResponse } from '@settlers/shared';

export class ServerException extends WsException {
  constructor(type: SocketExceptions, message?: string | object) {
    const serverExceptionResponse: ServerExceptionResponse = {
      exception: type,
      message: message,
    };

    super(serverExceptionResponse);
  }
}
