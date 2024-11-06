import { Socket } from 'socket.io';
import { GameAction, Player } from '../shared';

// settlement
export type SettlementType = 'city' | 'village' | null;
export type Spot = {
  id: number;
  settlementType: SettlementType;
  owner: Socket['id'] | null;
};

// roads
export type Road = {
  from: Spot['id'];
  to: Spot['id'];
  id: number;
  owner: Socket['id'] | null;
};

// tiles
export type Tile = {
  id: number;
  resource: Resource;
  value: number;
};

export type Resource = 'WOOD' | 'BRICK' | 'SHEEP' | 'WHEAT' | 'ORE' | 'ROBBERS';

export type Delta = {
  action: GameAction;
  player: Socket['id'];
  details: unknown;
  timestamp: number;
};
