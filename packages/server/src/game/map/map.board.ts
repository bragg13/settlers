import * as road_connections from './utils/road_connections.json';
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

export class MapBoard {
  private NUM_SPOTS = 54;
  private NUM_TILES = 19;
  public spots: Map<Spot['id'], Spot> = new Map<Spot['id'], Spot>();
  public tiles: Map<Tile['id'], Tile> = new Map<Tile['id'], Tile>();
  deltas: Delta[] = [];

  public roads: {
    [from: Spot['id']]: {
      [to: Spot['id']]: Road;
    };
  } = {};

  constructor() {
    for (let i = 1; i <= this.NUM_SPOTS; i++) {
      this.roads[i] = {};
    }
  }

  // initalise the graph
  public initSpot(spot_id: Spot['id']): void {
    this.spots.set(spot_id, {
      id: spot_id,
      owner: null,
      settlementType: null,
    });
  }

  public initRoad(road_id: number, spot1: Spot['id'], spot2: Spot['id']): void {
    this.roads[spot1][spot2] = {
      from: spot1,
      to: spot2,
      id: road_id,
      owner: null,
    };
    this.roads[spot2][spot1] = {
      from: spot2,
      to: spot1,
      id: road_id,
      owner: null,
    };
  }
  public getDeltaUpdates(): ServerPayloads[ServerEvents.DeltaUpdate] {
    const deltas = [...this.deltas];
    this.deltas = [];
    return deltas;
  }

  public initBoard(): void {
    // initialise the 'graph' part of the board aka spots/roads
    for (let spot = 1; spot <= this.NUM_SPOTS; spot++) {
      this.initSpot(spot);
      const from = spot.toString();
      for (const to of Object.keys(road_connections[from])) {
        // road = { 4: '1', 5: '2' }
        const road_id = parseInt(road_connections[from][to]);
        this.initRoad(road_id, parseInt(from), parseInt(to));
      }
    }

    // initialise the 'tiles' part of the board
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

      this.tiles.set(i + 1, {
        resource: tileResources[i],
        value: tileValue,
        id: i + 1,
      });
    }
    Logger.log('Board initialised');
  }

  public getAdjacentSpots(spot_id: Spot['id']): Array<Spot['id']> {
    const r = Object.keys(this.roads[spot_id]);
    console.log(r);
    return [];
  }

  // building roads and settlements
  public getAvailableSpots = (player: Socket['id']): Array<Spot> => {
    const spot: Spot = { id: 1, owner: null, settlementType: null };
    return [spot];
  };
  public getAvailableRoads = (player: Socket['id']): Array<Road> => {
    const road: Road = { from: 0, to: 1, id: 0, owner: null };
    return [road];
  };

  public buildSettlement(
    spot_id: Spot['id'],
    settlement_type: SettlementType,
    player: Socket['id']
  ): void {
    this.spots.set(spot_id, {
      id: spot_id,
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
    console.log(this.roads[spot1][spot2]);
    this.roads[spot1][spot2].owner = player;
    this.roads[spot2][spot1].owner = player;

    this.deltas.push({
      action: GameAction.ActionBuildRoad,
      player,
      details: {
        newRoad: this.roads[spot1][spot2],
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
