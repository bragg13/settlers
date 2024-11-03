export type ServerActionPayloads = {
  SETUP: {
    currentPlayer: string;
    availableActions: string[];
    currentRound: number;
    availableSpots: number[] | null;
    availableRoads: number[] | null;
  };
  DICE_ROLL: {};
  TURN: {};
  BUILD: {};
  TRADE: {};
  ROBBERS: {};
  GAME_END: {};
};
