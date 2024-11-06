import { Delta, GameAction, Resource, Road, Spot } from '../shared';
import { Socket } from 'socket.io';
import { ServerEvents } from './ServerEvents';
import { Player } from './types';

export type ServerPayloads = {
  [ServerEvents.GameMessage]: {
    color: string;
    message: string;
  };
  [ServerEvents.LobbyState]: {
    lobbyId: string;
    hasStarted: boolean;
    hasEnded: boolean;
    currentPlayer: string;
    currentRound: number;
    players: Array<Player>; // TODO: to remove
  };
  [ServerEvents.DeltaUpdate]: Delta[];
  // newSettlements: Spot[] | null;
  // newRoads: Road[] | null;
  // newResources: Map<
  //   Resource,
  //   { player: Socket['id']; amount: number }
  // > | null;
  // rolledDice: number[];
  // ...
  [ServerEvents.AvailableActions]: {
    availableActions: string[];
    buildableSpots: Spot[] | null;
    buildableRoads: Road[] | null;
    buildableCities: Spot[] | null;
    // ...
  };
  [ServerEvents.ChatMessage]: {
    creator: Socket['id'];
    username: string;
    text: string;
  };
};
