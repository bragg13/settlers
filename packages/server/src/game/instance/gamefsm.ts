import { Logger } from '@nestjs/common';

type State =
  | 'SETUP'
  | 'DICE_ROLL'
  | 'TURN'
  | 'BUILD'
  | 'TRADE'
  | 'ROBBERS'
  | 'RESOURCE_GATHER'
  | 'END';

type GameActionType = 'setupSettlement' | 'setupRoad' | 'diceRoll' | 'moveRobbers' | 'selectRobbersPlayer' | 'trade' | 'endTurn' | 'robberMove'  | 'endGame'

export class GameFSM {
  private state: State = 'SETUP';
  private validTransitions: { [key in State]: State[] } = {
    SETUP: ['DICE_ROLL'],
    DICE_ROLL: ['ROBBERS', 'TURN'],
    ROBBERS: ['ROBBERS', 'TURN'],
    TURN: ['BUILD', 'TRADE', 'END', 'DICE_ROLL'],
    BUILD: ['TURN'],
    TRADE: ['TURN'],
    END: [],
  };

  public transitionTo(state: State): void {
    if (this.validTransitions[this.state].includes(state)) {
      this.state = state;
      Logger.log(`Transitioned to state: ${state}`);
    } else {
      Logger.error(`Invalid transition from ${this.state} to ${state}`);
    }
  }

  public getState(): State {
    return this.state;
  }

  public handleAction(action: GameActionType): void {
    switch(action)
  }

}
