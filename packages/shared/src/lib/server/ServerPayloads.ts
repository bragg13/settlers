import { Delta, Road, Spot } from '../shared';
import { Socket } from 'socket.io';
import { ServerEvents } from './ServerEvents';
import { Player } from './types';

export type ServerPayloads = {
  [ServerEvents.GameMessage]: {
    color: string;
    message: string;
  };
  [ServerEvents.PlayerInformation]: Player;
  [ServerEvents.ResourcesGathered]: {
    BRICK: number;
    ORE: number;
    SHEEP: number;
    WHEAT: number;
    WOOD: number;
  };
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    hasStarted: boolean;
    hasEnded: boolean;
    currentPlayer: string;
    currentRound: number;
    players: Array<Player>;
    boardState:
      | {
          spots: string;
          tiles: string;
          roads: string;
        }
      | undefined;
  };
  [ServerEvents.DeltaUpdate]: Delta[];

  [ServerEvents.AvailableActions]: {
    availableActions: string[];
    buildableSpots: Spot['id'][] | null;
    buildableRoads: Road['id'][] | null;
    buildableCities: Spot['id'][] | null;
    // ...
  };
  [ServerEvents.ChatMessage]: {
    creator: Socket['id'];
    username: string;
    text: string;
  };
};
