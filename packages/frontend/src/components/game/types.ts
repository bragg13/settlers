import { ServerEvents, ServerPayloads } from '@settlers/shared';

export type GameContextType = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState];
  setLobbyState: (state: ServerPayloads[ServerEvents.LobbyState]) => void;
  gameState: ServerPayloads[ServerEvents.GameState];
  setGameState: (state: ServerPayloads[ServerEvents.GameState]) => void;
};
