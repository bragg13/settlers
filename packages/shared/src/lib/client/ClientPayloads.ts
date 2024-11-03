import { ClientEvents } from './ClientEvents';

export type ClientPayloads = {
  [ClientEvents.LobbyJoin]: {
    username: string;
    color: string;
    lobbyId: string;
  };
};
