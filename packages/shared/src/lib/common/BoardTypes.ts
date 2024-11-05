import { Player } from '../shared';

// settlement
export type SettlementType = 'city' | 'village' | null;
export type Spot = {
  id: number;
  settlementType: SettlementType;
  owner: Player | null;
};

// roads
export type Road = {
  from: Spot['id'];
  to: Spot['id'];
  id: number;
  owner: Player | null;
};

// tiles
export type Tile = {
  id: number;
  resource: Resource;
  value: number;
};

export type Resource =
  | 'WOOD '
  | 'BRICK '
  | 'SHEEP'
  | 'WHEAT'
  | 'ORE '
  | 'ROBBERS ';
