import { Player, ServerEvents, ServerPayloads } from '@settlers/shared';

export type GameContextType = {
  lobbyState: ServerPayloads[ServerEvents.LobbyState];
  setLobbyState: (state: ServerPayloads[ServerEvents.LobbyState]) => void;
  availableActions: ServerPayloads[ServerEvents.AvailableActions];
  setAvailableActions: (
    state: ServerPayloads[ServerEvents.AvailableActions]
  ) => void;
  playerInformation: Player;
  setPlayerInformation: (state: Player) => void;
};
