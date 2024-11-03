export type State =
  | 'SETUP'
  | 'DICE_ROLL'
  | 'TURN'
  | 'TRADE'
  | 'ROBBERS'
  | 'GAME_END';

export enum GameAction {
  // setup
  ActionSetupSettlement = 'client.actionSetupSettlement',
  ActionSetupRoad = 'client.actionSetupRoad',

  // dice roll
  ActionDiceRoll = 'client.actionDiceRoll',

  // robbers
  ActionMoveRobber = 'client.actionMoveRobber',
  ActionRobPlayer = 'client.actionRobPlayer',

  // turn
  ActionBuildSettlement = 'client.actionBuildSettlement',
  ActionBuildCity = 'client.actionBuildCity',
  ActionBuildRoad = 'client.actionBuildRoad',
  // ActionBuyDevelopmentCard = 'client.actionBuyDevelopmentCard',
  // ActionPlayDevelopmentCard = 'client.actionPlayDevelopmentCard',
  ActionInitTrade = 'client.actionTrade',
  ActionEndTurn = 'client.actionEndTurn',

  // trade
  ActionAcceptTrade = 'client.actionAcceptTrade',
  ActionDeclineTrade = 'client.actionDeclineTrade',
}
