import { Road, Spot } from '../shared';
import { ClientEvents } from './ClientEvents';

export type ClientPayloads = {
  // lobby
  [ClientEvents.LobbyJoin]: {
    username: string;
    color: string;
    lobbyId: string;
  };

  // setup
  [ClientEvents.ActionSetupSettlement]: {
    spotId: Spot['id'];
    // can obtain by socket id
    // player: string;
    // color: string;
    // the reply will be the updated game state with the new settlement
  };
  [ClientEvents.ActionSetupRoad]: {
    roadId: Road['id'];
  };

  // dice roll - no payload, the server actually rolls the dices
  [ClientEvents.ActionDiceRoll]: null;

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
