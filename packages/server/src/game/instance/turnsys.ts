import { Socket } from 'socket.io';

export class TurnSystem {
  private currentPlayerIndex = 0;
  private currentRound = 0;

  constructor(public players: Socket['id'][]) {}

  public getCurrentPlayer(): Socket['id'] {
    return this.players[this.currentPlayerIndex];
  }
  public getCurrentPlayerIndex(): number {
    return this.currentPlayerIndex;
  }

  public nextTurn(): void {
    this.currentPlayerIndex++;
    if (this.currentPlayerIndex >= 4) {
      this.currentPlayerIndex = 0;
    }
    this.currentRound++;

    console.log(`Player ${this.getCurrentPlayer()} is playing next`);
  }
}
