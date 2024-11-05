import { GameAction } from '../shared';
import { Socket } from 'socket.io';
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
  [ServerEvents.GameState]: {
    currentPlayer: string;
    currentRound: number;
  };
  [ServerEvents.ChatMessage]: {
    creator: Socket['id'];
    username: string;
    text: string;
  };
  [ServerEvents.AvailableActions]: {
    availableActions: string[];
  };
  [GameAction.ActionBuildRoad]: {
    availableRoads: string[];
  };
  [GameAction.ActionBuildSettlement]: {
    availableSpots: string[];
  };
  [GameAction.ActionBuildCity]: {
    availableSpots: string[];
  };
};
