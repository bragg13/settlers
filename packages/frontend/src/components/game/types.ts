import { Player, ServerEvents, ServerPayloads } from '@settlers/shared';
import { MutableRefObject } from 'react';

export type GameContextType = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState];
  setLobbyState: (state: ServerPayloads[ServerEvents.LobbyState]) => void;
  gameState: ServerPayloads[ServerEvents.GameState];
  setGameState: (state: ServerPayloads[ServerEvents.GameState]) => void;
  playerInformation: Player;
  setPlayerInformation: (state: Player) => void;
};
