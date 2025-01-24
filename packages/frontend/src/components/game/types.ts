import { Player, ServerEvents, ServerPayloads } from '@settlers/shared';
import { Clay3DTile } from '../tiles/Clay';
import { Robbers3DTile } from '../tiles/Robbers';
import { Rocks3DTile } from '../tiles/Rocks';
import { Sheep3DTile } from '../tiles/Sheep';
import { Wheat3DTile } from '../tiles/Wheat';
import { Wood3DTile } from '../tiles/Wood';

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

export type Tile3D =
  | typeof Clay3DTile
  | typeof Robbers3DTile
  | typeof Rocks3DTile
  | typeof Sheep3DTile
  | typeof Wheat3DTile
  | typeof Wood3DTile;

export const resourceToModel = {
  WOOD: Wood3DTile,
  BRICK: Clay3DTile,
  ROBBERS: Robbers3DTile,
  ORE: Rocks3DTile,
  SHEEP: Sheep3DTile,
  WHEAT: Wheat3DTile,
};
