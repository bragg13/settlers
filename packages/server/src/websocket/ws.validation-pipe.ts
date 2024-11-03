import { Injectable, ValidationPipe } from '@nestjs/common';
import { SocketExceptions } from '@settlers/shared';
import { ServerException } from '../game/server.exception';

// a cute way to handle exceptions and errors for what concerns sockets
@Injectable()
export class WsValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors = []) => {
      if (this.isDetailedOutputDisabled) {
        return new ServerException(
          SocketExceptions.UnexpectedError,
          'Bad request'
        );
      }

      const errors = this.flattenValidationErrors(validationErrors);

      return new ServerException(SocketExceptions.UnexpectedPayload, errors);
    };
  }
}
