import { GameAction, Road, Spot } from '../shared';
import { ClientEvents } from './ClientEvents';

export type ClientPayloads = {
  // lobby
  [ClientEvents.LobbyJoin]: {
    username: string;
    color: string;
    lobbyId: string;
  };

  // setup
  [GameAction.ActionSetupSettlement]: {
    spotId: Spot['id'];
  };
  [GameAction.ActionSetupRoad]: {
    roadId: Road['id'];
    spot1: Spot['id'];
    spot2: Spot['id'];
  };

  // dice roll - no payload, the server actually rolls the dices
  [GameAction.ActionDiceRoll]: null;

  [ClientEvents.ChatMessage]: {
    text: string;
  };
  // robbers
  // [ClientEvents.ActionMoveRobber]: {

  // }
  // [ClientEvents.ActionRobPlayer]: {

  // }

  // // turn
  // [ClientEvents.ActionBuildSettlement]: {

  // }
  // [ClientEvents.ActionBuildCity]: {

  // }
  // [ClientEvents.ActionBuildRoad]: {

  // }
  // [ClientEvents.ActionBuyDevelopmentCard]: {

  // }
  // [ClientEvents.ActionPlayDevelopmentCard]: {

  // }
  // [ClientEvents.ActionTrade]: {

  // }
  // [ClientEvents.ActionEndTurn]: {
  // }
};
