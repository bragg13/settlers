import { Socket } from 'socket.io';

export type DiceRollResult = {
  diceResult: number;
  resourceToPlayer: {
    [player: Socket['id']]: {
      WOOD: number;
      WHEAT: number;
      SHEEP: number;
      BRICK: number;
      ORE: number;
    };
  };
};
