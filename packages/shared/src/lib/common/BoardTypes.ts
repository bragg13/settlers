import { Socket } from 'socket.io';
import { GameAction, Player } from '../shared';

export type screenPosition = {
  x: number;
  y: number;
  z: number;
};
export type spotBoardPosition = {
  tile: number;
  tileCorner: number;
};
export type roadBoardPosition = {
  from: Spot['id'];
  to: Spot['id'];
};
export type roadScreenPosition = {
  x: number;
  y: number;
  yangle: number;
  z: number;
};
export type tileBoardPosition = {
  q: number;
  r: number;
};

// settlement
export type SettlementType = 'city' | 'village' | null;
export type Spot = {
  id: number;
  settlementType: SettlementType;
  owner: Socket['id'] | null;
  position: {
    screen: screenPosition;
    board: spotBoardPosition;
  };
};

// roads
export type Road = {
  id: number;
  owner: Socket['id'] | null;
  position: {
    board: roadBoardPosition;
    screen: roadScreenPosition;
  };
};

// tiles
export type Tile = {
  id: number;
  resource: Resource;
  value: number;
  position: {
    screen: screenPosition;
    board: tileBoardPosition;
  };
};

export type Resource = 'WOOD' | 'BRICK' | 'SHEEP' | 'WHEAT' | 'ORE' | 'ROBBERS';

export type Delta = {
  action: GameAction;
  player: Socket['id'];
  details: unknown;
  timestamp: number;
} | null;
