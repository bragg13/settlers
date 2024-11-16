import { Socket } from 'socket.io';
import { GameAction, Player } from '../shared';

// settlement
export type SettlementType = 'city' | 'village' | null;
export type Spot = {
  id: number;
  settlementType: SettlementType;
  owner: Socket['id'] | null;
  position: {
    screen: {
      x: number;
      y: number;
      z: number;
    };
    board: {
      hex: number;
      hexCorner: number;
    };
  };
};

// roads
export type Road = {
  id: number;
  owner: Socket['id'] | null;
  position: {
    board: {
      from: Spot['id'];
      to: Spot['id'];
    };
    screen: {
      x: number;
      y: number;
      z: number;
      yangle: number;
    };
  };
};

// tiles
export type Tile = {
  id: number;
  resource: Resource;
  value: number;
  position: {
    screen: {
      x: number;
      y: number;
      z: number;
    };
    board: {
      q: number;
      r: number;
    };
  };
};

export type Resource = 'WOOD' | 'BRICK' | 'SHEEP' | 'WHEAT' | 'ORE' | 'ROBBERS';

export type Delta = {
  action: GameAction;
  player: Socket['id'];
  details: unknown;
  timestamp: number;
} | null;
