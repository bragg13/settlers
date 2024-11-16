import * as road_connections from './utils/road_connections.json';
import * as board_coordinates from './utils/board_coordinates.json';
import * as board_constants from './utils/board_constants.json';
import { Logger } from '@nestjs/common';
import {
  Delta,
  GameAction,
  Resource,
  Road,
  ServerEvents,
  ServerPayloads,
  SettlementType,
  Spot,
  Tile,
} from '@settlers/shared';
import { Socket } from 'socket.io';
import { randomInt } from 'crypto';
import { bfs_roads, bfs_spots } from './utils/bfs';

export class MapBoard {
  private NUM_SPOTS = 54;
  private NUM_TILES = 19;
  private Y_SPOT = 1;
  private Y_TILE = 0;
  private HEX_SIZE = 0.6;
  public spots: Map<Spot['id'], Spot> = new Map<Spot['id'], Spot>();
  public tiles: Map<Tile['id'], Tile> = new Map<Tile['id'], Tile>();
  public roads: Map<Road['id'], Road> = new Map<Road['id'], Road>();
  deltas: Delta[] = [];

  public roadsGraph: {
    [from: Spot['id']]: {
      [to: Spot['id']]: Road;
    };
  } = {};

  constructor() {
    for (let i = 1; i <= this.NUM_SPOTS; i++) {
      this.roadsGraph[i] = {};
    }
  }

  // initalise the graph
  public initSpot(
    spot_id: Spot['id'],
    tilePositionBoard: Tile['position']['board'],
    spotPositionBoard: Spot['position']['board']
  ): void {
    // get screen position of tile
    const tileScreenPosition = this.tileBoardToScreen(tilePositionBoard);

    // get spot position on screen
    const spotTileCorner = spotPositionBoard.hexCorner;
    const spotPositionScreen = this.spotBoardToScreen(
      tileScreenPosition,
      spotTileCorner
    );

    this.spots.set(spot_id, {
      id: spot_id,
      owner: null,
      settlementType: null,
      position: {
        screen: {
          ...spotPositionScreen,
        },
        board: {
          ...spotPositionBoard,
        },
      },
    });
  }

  public initRoad(
    road_id: Road['id'],
    spot1: Spot['id'],
    spot2: Spot['id'],
    position: Road['position']
  ): void {
    this.roadsGraph[spot1][spot2] = {
      from: spot1,
      to: spot2,
      id: road_id,
      owner: null,
      position: { ...position },
    };
    this.roadsGraph[spot2][spot1] = {
      from: spot2,
      to: spot1,
      id: road_id,
      owner: null,
      position: { ...position },
    };
    this.roads.set(road_id, {
      from: spot1,
      to: spot2,
      id: road_id,
      owner: null,
      position: { ...position },
    });
  }
  public getDeltaUpdates(): ServerPayloads[ServerEvents.DeltaUpdate] {
    const deltas = [...this.deltas];
    this.deltas = [];
    return deltas;
  }

  private spotBoardToScreen(
    tileScreenPosition: Tile['position']['screen'],
    tileCorner: number
  ) {
    const angle_deg = 60 * tileCorner - 30;
    const angle_rad = (Math.PI / 180) * angle_deg;
    const x = tileScreenPosition.x + this.HEX_SIZE * Math.cos(angle_rad);
    const z = tileScreenPosition.z + this.HEX_SIZE * Math.sin(angle_rad);
    return { x, y: this.Y_SPOT, z };
  }

  private tileBoardToScreen(boardPosition: Tile['position']['board']) {
    const x =
      this.HEX_SIZE *
      (Math.sqrt(3) * boardPosition.q + (Math.sqrt(3) / 2) * boardPosition.r);
    const z = this.HEX_SIZE * ((3 / 2) * boardPosition.r);
    return { x, y: this.Y_TILE, z };
  }

  public initBoard(): void {
    // initialise the 'graph' part of the board aka spots/roads
    const tilesCoordinates = board_coordinates['tiles'];
    const spotsCoordinates = board_coordinates['spots'];
    const roadsCoordinates = board_coordinates['roads'];

    // tiles
    const tileValues = board_constants['tileValues'].sort(
      () => Math.random() - 0.5
    );
    const tileResources: Resource[] = board_constants['resourceValues'].sort(
      () => Math.random() - 0.5
    ) as Resource[];
    let valueIndex = 0;

    for (let i = 0; i < tileResources.length; i++) {
      const tileValue =
        tileResources[i] === 'ROBBERS' ? 7 : tileValues[valueIndex++];
      const tilePositionBoard = tilesCoordinates[(i + 1).toString()];
      const tilePositionScreen = this.tileBoardToScreen(tilePositionBoard);

      this.tiles.set(i + 1, {
        resource: tileResources[i],
        value: tileValue,
        id: i + 1,
        position: {
          board: tilePositionBoard,
          screen: tilePositionScreen,
        },
      });
    }

    // spots and roads
    for (let spotId = 1; spotId <= this.NUM_SPOTS; spotId++) {
      const spotPositionBoard = spotsCoordinates[spotId.toString()];
      const tilePositionBoard = this.tiles.get(spotPositionBoard.hex).position
        .board;
      this.initSpot(spotId, tilePositionBoard, spotPositionBoard);

      const from = spotId.toString();

      for (const to of Object.keys(road_connections[from])) {
        // road = { 4: '1', 5: '2' }
        const roadId = road_connections[from][to];
        const roadPosition = roadsCoordinates[roadId];

        this.initRoad(
          parseInt(roadId),
          parseInt(from),
          parseInt(to),
          roadPosition
        );
      }
    }
    Logger.log('Board initialised');
  }

  public getAdjacentSpots(spot_id: Spot['id']): Array<Spot['id']> {
    const r = Object.keys(this.roadsGraph[spot_id]);
    return [];
  }

  // building roads and settlements
  public getAvailableSpots = (player: Socket['id']): Array<Spot> => {
    const settlementsBuiltByPlayer = this.getSettlementsBuiltBy(player);
    if (settlementsBuiltByPlayer.length < 2) {
      return this.getSettlementsBuiltBy(null);
    }
    return bfs_spots(settlementsBuiltByPlayer, this.spots, this.roads, player);
  };

  public getAvailableRoads = (player: Socket['id']): Array<Road> => {
    const settlementsBuiltByPlayer = this.getSettlementsBuiltBy(player);
    return bfs_roads(
      settlementsBuiltByPlayer,
      this.spots,
      this.roadsGraph,
      player
    );
  };

  // there is for sure a better way
  public getSettlementsBuiltBy = (player: Socket['id'] | null): Array<Spot> => {
    const playerTowns = [];
    for (const [, spot] of this.spots.entries()) {
      if (spot.owner === player) playerTowns.push(spot);
    }
    return playerTowns;
  };

  public buildSettlement(
    spot_id: Spot['id'],
    settlement_type: SettlementType,
    player: Socket['id']
  ): void {
    const spot = this.spots.get(spot_id);
    this.spots.set(spot_id, {
      ...spot,
      owner: player,
      settlementType: settlement_type,
    });

    // adjacent spots are not buildable anymore
    const adjs = this.getAdjacentSpots(spot_id);
    for (const adj of adjs) {
      console.log(adj);
    }

    this.deltas.push({
      action: GameAction.ActionBuildSettlement,
      player,
      details: {
        newSettlement: spot_id,
        adjacent: [...adjs],
      },
      timestamp: Date.now(),
    });
  }

  public buildRoad(
    spot1: Spot['id'],
    spot2: Spot['id'],
    player: Socket['id']
  ): void {
    this.roadsGraph[spot1][spot2].owner = player;
    this.roadsGraph[spot2][spot1].owner = player;

    const roadId = this.roadsGraph[spot1][spot2].id;
    const road = this.roads.get(roadId);
    this.roads.set(roadId, {
      ...road,
      owner: player,
    });

    console.log(`built: ${this.roadsGraph[spot1][spot2]}`);
    this.deltas.push({
      action: GameAction.ActionBuildRoad,
      player,
      details: {
        newRoad: this.roadsGraph[spot1][spot2],
      },
      timestamp: Date.now(),
    });
  }

  public rollDice(player: Socket['id']): number[] {
    const dice = [randomInt(1, 7), randomInt(1, 7)];

    this.deltas.push({
      action: GameAction.ActionDiceRoll,
      player,
      details: {
        dice,
      },
      timestamp: Date.now(),
    });

    return dice;
  }
}
