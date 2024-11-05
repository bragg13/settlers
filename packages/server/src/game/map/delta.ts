import { GameAction } from '@settlers/shared';
import { Socket } from 'socket.io';

export type Delta = {
  action: GameAction;
  player: Socket['id'];
  details: unknown;
  timestamp: number;
};
