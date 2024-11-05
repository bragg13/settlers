import { Road, Spot } from '../shared';

export type ServerActionPayloadsWrapper = {
  SETUP: {
    availableActions: string[];
    availableSpots: Spot[] | null;
    availableRoads: Road[] | null;
  };
  DICE_ROLL: {};
  TURN: {};
  BUILD: {};
  TRADE: {};
  ROBBERS: {};
  GAME_END: {};
};
