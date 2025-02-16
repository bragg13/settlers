import { Player, ServerEvents, ServerPayloads } from '@settlers/shared';
import { Clay3DTile } from '../tiles/Clay';
import { Robbers3DTile } from '../tiles/Robbers';
import { Rocks3DTile } from '../tiles/Rocks';
import { Sheep3DTile } from '../tiles/Sheep';
import { Wheat3DTile } from '../tiles/Wheat';
import { Wood3DTile } from '../tiles/Wood';
import { Num_2 } from '../models/numbers/Num_2';
import { Num_3 } from '../models/numbers/Num_3';
import { Num_4 } from '../models/numbers/Num_4';
import { Num_5 } from '../models/numbers/Num_5';
import { Num_6 } from '../models/numbers/Num_6';
import { Num_8 } from '../models/numbers/Num_8';
import { Num_9 } from '../models/numbers/Num_9';
import { Num_10 } from '../models/numbers/Num_10';
import { Num_11 } from '../models/numbers/Num_11';
import { Num_12 } from '../models/numbers/Num_12';

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

export const tileResourceToModel = {
  WOOD: Wood3DTile,
  BRICK: Clay3DTile,
  ROBBERS: Robbers3DTile,
  ORE: Rocks3DTile,
  SHEEP: Sheep3DTile,
  WHEAT: Wheat3DTile,
};

export const tileValueToModel = {
  NUM2: Num_2,
  NUM3: Num_3,
  NUM4: Num_4,
  NUM5: Num_5,
  NUM6: Num_6,
  NUM8: Num_8,
  NUM9: Num_9,
  NUM10: Num_10,
  NUM11: Num_11,
  NUM12: Num_12,
};
