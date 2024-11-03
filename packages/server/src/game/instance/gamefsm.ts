import { Logger } from '@nestjs/common';
import { ClientEvents, GameAction, State } from '@settlers/shared';

export class GameFSM {
  private state: State = 'SETUP';
  private validTransitions: { [key in State]: State[] } = {
    SETUP: ['SETUP', 'DICE_ROLL'],
    DICE_ROLL: ['ROBBERS', 'TURN'],
    ROBBERS: ['ROBBERS', 'TURN'],
    TURN: ['TRADE', 'GAME_END', 'DICE_ROLL'],
    TRADE: ['TURN'],
    GAME_END: [],
  };
  private validActions: { [key in State]: GameAction[] } = {
    SETUP: [GameAction.ActionSetupSettlement, GameAction.ActionSetupRoad],
    DICE_ROLL: [GameAction.ActionDiceRoll],
    ROBBERS: [GameAction.ActionMoveRobber, GameAction.ActionRobPlayer],
    TURN: [
      GameAction.ActionInitTrade,
      GameAction.ActionBuildSettlement,
      GameAction.ActionBuildCity,
      GameAction.ActionBuildRoad,
      GameAction.ActionEndTurn,
    ],
    TRADE: [GameAction.ActionAcceptTrade, GameAction.ActionDeclineTrade],
    GAME_END: [],
  };

  public getState(): State {
    return this.state;
  }

  // retrieve available actions for the current state
  public getAvailableActions(): GameAction[] {
    return this.validActions[this.state];
  }

  // transition to a new state
  public transitionTo(state: State): void {
    if (this.validTransitions[this.state].includes(state)) {
      this.state = state;
      Logger.log(`Transitioned to state: ${state}`);
    } else {
      Logger.error(`Invalid transition from ${this.state} to ${state}`);
    }
  }

  // handle action from clientClientPayloads[ClientEvents.ActionSetupSettlement]
  // public handleAction<T extends keyof ClientPayloads>(
  //   action: T,
  //   payload: ClientPayloads[T]
  // ): void {
  //   switch (this.state) {
  //     case 'SETUP':
  //       if (action == ClientEvents.ActionSetupSettlement) {
  //         return true
  //       } else if (action == ClientEvents.ActionSetupRoad) {
  //       } else {
  //         Logger.error(`Invalid action ${action} in state ${this.state}`);
  //       }
  //       break;
  //     case 'DICE_ROLL':
  //       break;
  //     default:
  //       break;
  //   }
  // }
}
