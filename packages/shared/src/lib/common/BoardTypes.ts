// settlement
export type SettlementType = 'city' | 'village' | null;
export type Spot = {
  id: number;
  settlementType: SettlementType;
  owner: Owner;
};

// roads
export type Road = {
  from: Spot['id'];
  to: Spot['id'];
  id: number;
  owner: Owner;
};
export type Owner = string | null;

// tiles
export type Tile = {
  id: number;
  resource: Resource;
  value: number;
};

export enum Resource {
  WOOD = 'wood',
  BRICK = 'brick',
  SHEEP = 'sheep',
  WHEAT = 'wheat',
  ORE = 'ore',
  ROBBERS = 'robbers',
}
