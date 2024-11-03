export enum ClientEvents {
  // lobby
  LobbyJoin = 'client.lobbyJoin',
  LobbyLeave = 'client.lobbyleave',

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
  ActionBuyDevelopmentCard = 'client.actionBuyDevelopmentCard',
  ActionPlayDevelopmentCard = 'client.actionPlayDevelopmentCard',
  ActionTrade = 'client.actionTrade',
  ActionEndTurn = 'client.actionEndTurn',

  // chat
  // ...
}
