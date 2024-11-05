import { Logger } from '@nestjs/common';
import { GameAction, State } from '@settlers/shared';

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

  public setupSteps: number[];

  public getState(): State {
    return this.state;
  }

  public getActionsForSetup(currentPlayerIndex: number): GameAction[] {
    Logger.log(
      `setup steps for ${currentPlayerIndex} are ${this.setupSteps[currentPlayerIndex]}`
    );
    switch (this.setupSteps[currentPlayerIndex]) {
      case 0:
        // game just started
        return [GameAction.ActionSetupSettlement];
      case 1:
        // just placed a settlement
        return [GameAction.ActionSetupRoad];
      case 2:
        // placed one settlement and one road
        return [GameAction.ActionSetupSettlement];
      case 3:
        // just missing one final road
        return [GameAction.ActionSetupRoad];
      default:
        return [];
    }
  }

  // retrieve available actions for the current state
  public getAvailableActions(currentPlayerIndex: number): GameAction[] {
    if (this.state === 'SETUP') {
      return this.getActionsForSetup(currentPlayerIndex);
    }

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
}
