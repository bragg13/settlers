import { ServerEvents } from './ServerEvents';

export type ServerPayloads = {
  [ServerEvents.GameMessage]: {
    color: string;
    message: string;
  };
  // lobby state contains events about the lobby and the match
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    hasStarted: boolean;
    hasEnded: boolean;
    // currentRound: number;
    // currentPlayerIndex: number;
    players: Array<{
      username: string;
      color: string;
    }>;
  };
};
