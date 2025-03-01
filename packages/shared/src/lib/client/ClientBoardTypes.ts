import { Tile } from '../shared';
import { BoardAnimation } from './ClientEvents';

export type ClientTile = Tile & {
  animationsQueue: Array<BoardAnimation>;
};
