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
export type SettlementType = 'city' | 'village' | 'unbuildable' | null;
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

// delta updates
export type DeltaDetail = {
  [GameAction.ActionSetupSettlement]: {
    newSettlement: Spot['id'];
    adjacent: Array<Spot>;
  };

  [GameAction.ActionSetupRoad]: {
    newRoad: Road;
  };

  [GameAction.ActionDiceRoll]: {
    dice: Array<number>;
  };

  [GameAction.ActionMoveRobber]: { placeholder: number };
  [GameAction.ActionRobPlayer]: { placeholder: number };

  // turn
  [GameAction.ActionBuildSettlement]: { placeholder: number };
  [GameAction.ActionBuildCity]: { placeholder: number };
  [GameAction.ActionBuildRoad]: { placeholder: number };
  [GameAction.ActionInitTrade]: { placeholder: number };
  [GameAction.ActionEndTurn]: { placeholder: number };

  // trade
  [GameAction.ActionAcceptTrade]: { placeholder: number };
  [GameAction.ActionDeclineTrade]: { placeholder: number };
};

// delta details can be any of the above
type DeltaDetailUnion = DeltaDetail[keyof DeltaDetail];

export type Delta = {
  action: GameAction;
  player: Socket['id'];
  details: DeltaDetailUnion;
  timestamp: number;
} | null;
