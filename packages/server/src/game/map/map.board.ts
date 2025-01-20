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
import {
  roadScreenPosition,
  screenPosition,
  spotBoardPosition,
  tileBoardPosition,
} from 'packages/shared/src/lib/common/BoardTypes';

export class MapBoard {
  private NUM_SPOTS = 54;
  private Y_SPOT = 0.2;
  private Y_ROAD = 0.18;
  private Y_TILE = 0;
  private HEX_SIZE = 0.6;
  public spots: Map<Spot['id'], Spot> = new Map<Spot['id'], Spot>();
  public tiles: Map<Tile['id'], Tile> = new Map<Tile['id'], Tile>();
  public roads: Map<Road['id'], Road> = new Map<Road['id'], Road>();
  deltas: Delta[] = [];

  // potrebbe essere overkill, basta l'id e non l'intera road
  public roadsGraph: {
    [from: Spot['id']]: {
      [to: Spot['id']]: Road['id'];
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
    tilePositionBoard: tileBoardPosition,
    spotPositionBoard: spotBoardPosition
  ): void {
    // get screen position of tile
    const tileScreenPosition = this.tileBoardToScreen(tilePositionBoard);

    // get spot position on screen
    const spotTileCorner = spotPositionBoard.tileCorner;
    const spotPositionScreen = this.spotBoardToScreen(
      tileScreenPosition,
      spotTileCorner
    );

    const spotData = {
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
    };
    this.spots.set(spot_id, spotData);
  }

  public initRoad(
    road_id: Road['id'],
    spot1: Spot['id'],
    spot2: Spot['id']
  ): void {
    const screenPosition: roadScreenPosition =
      this.roadScreenPositionGivenSpots(spot1, spot2);
    const roadObject = {
      id: road_id,
      owner: null,
      position: {
        board: {
          from: spot1,
          to: spot2,
        },
        screen: {
          x: screenPosition.x,
          y: screenPosition.y,
          yangle: screenPosition.yangle,
          z: screenPosition.z,
        },
      },
    };

    // i could directly import road_connections as roadsGraph
    this.roadsGraph[spot1][spot2] = road_id;
    this.roadsGraph[spot2][spot1] = road_id;
    this.roads.set(road_id, roadObject);
  }

  public getDeltaUpdates(): ServerPayloads[ServerEvents.DeltaUpdate] {
    const deltas = [...this.deltas];
    this.deltas = [];
    return deltas;
  }

  // helpers for coordinates
  private spotBoardToScreen(
    tileScreenPosition: screenPosition,
    tileCorner: number
  ): screenPosition {
    const angle_deg = 60 * tileCorner + 30;
    const angle_rad = (Math.PI / 180) * angle_deg;
    const x = tileScreenPosition.x + this.HEX_SIZE * Math.cos(angle_rad);
    const z = tileScreenPosition.z + this.HEX_SIZE * Math.sin(angle_rad);
    return { x, y: this.Y_SPOT, z };
  }

  private tileBoardToScreen(boardPosition: tileBoardPosition): screenPosition {
    const x =
      this.HEX_SIZE *
      (Math.sqrt(3) * boardPosition.q + (Math.sqrt(3) / 2) * boardPosition.r);
    const z = this.HEX_SIZE * ((3 / 2) * boardPosition.r);
    return { x, y: this.Y_TILE, z };
  }

  private roadScreenPositionGivenSpots(
    spot1: Spot['id'],
    spot2: Spot['id']
  ): roadScreenPosition {
    // get spot positions on screen
    const pos1: screenPosition = this.spots.get(spot1).position.screen;
    const pos2: screenPosition = this.spots.get(spot2).position.screen;

    let yangle: number;
    const x1: number = pos1.x;
    const x2: number = pos2.x;
    const z1: number = pos1.z;
    const z2: number = pos2.z;

    // calculate mid point
    const midX: number = (x1 + x2) / 2;
    const midZ: number = (z1 + z2) / 2;

    // console.log('==');
    // console.log(`spot ${spot2} pos ${x2} ${z2}`);
    // console.log(`spot ${spot1} pos ${x1} ${z1}`);

    // calculate y rotation angle
    const epsilon = 0.00000000001;
    if (Math.abs(x1 - x2) < epsilon) {
      yangle = 3.14 / 2;
      console.log('|');
    } else if (x1 < x2 && z1 < z2) {
      yangle = 2.62;
    } else {
      yangle = 0.52;
    }

    return {
      x: midX,
      y: this.Y_ROAD,
      z: midZ,
      yangle,
    };
  }

  // main initialisation function for the board
  public initBoard(): void {
    // initialise the 'graph' part of the board aka spots/roads
    const tilesCoordinates = board_coordinates['tiles'];
    const spotsCoordinates = board_coordinates['spots'];

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
      const tilePositionBoard: tileBoardPosition =
        tilesCoordinates[(i + 1).toString()];
      const tilePositionScreen: screenPosition =
        this.tileBoardToScreen(tilePositionBoard);

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

    // spots and roads - currently doing 2 for loops because
    // to calculate road screen position i need spots positions
    for (
      let spotId = 1;
      spotId <= Object.keys(spotsCoordinates).length;
      spotId++
    ) {
      const spotPositionBoard: spotBoardPosition =
        spotsCoordinates[spotId.toString()];
      const tilePositionBoard: tileBoardPosition = this.tiles.get(
        spotPositionBoard.tile
      ).position.board;
      this.initSpot(spotId, tilePositionBoard, spotPositionBoard);
    }

    for (
      let spotId = 1;
      spotId <= Object.keys(spotsCoordinates).length;
      spotId++
    ) {
      const from = spotId.toString();

      for (const to of Object.keys(road_connections[from])) {
        const roadId = road_connections[from][to];
        const roadTobeSetup = this.roadsGraph[from][to] == undefined;

        if (roadTobeSetup) {
          this.initRoad(parseInt(roadId), parseInt(from), parseInt(to));
        }
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
    console.log('settl built by player:');
    console.log(settlementsBuiltByPlayer);
    return bfs_roads(
      settlementsBuiltByPlayer,
      this.spots,
      this.roadsGraph,
      this.roads,
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
    // this.roadsGraph[spot1][spot2].owner = player;
    // this.roadsGraph[spot2][spot1].owner = player;

    const roadId = this.roadsGraph[spot1][spot2];
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
        newRoad: road,
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
