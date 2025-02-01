import { useEffect, useRef, useState } from 'react';
import { useSocketManager } from '../../hooks/useSocketManager';
import {
  ClientPayloads,
  GameAction,
  Player,
  ServerEvents,
  ServerPayloads,
} from '@settlers/shared';
import { useAvailableActions, useLobbyState } from './GameContext';
import { render, Vector3 } from '@react-three/fiber';
import { Spot3D } from '../models/Spot3D';
import { Road3D } from '../models/Road3D';
import { useAtom } from 'jotai';
import { roadsAtom, spotsAtom, tilesAtom } from '../atoms';
import { showNotification } from '@mantine/notifications';
import {
  DeltaDetail,
  Road,
  Spot,
} from 'packages/shared/src/lib/common/BoardTypes';
import { resourceToModel } from './types';
import {
  roadRender,
  spawnRoadRender,
  spawnSpotRender,
  spotRender,
} from './Board.elements';

const Board = () => {
  const sm = useSocketManager();
  const [tiles, setTiles] = useAtom(tilesAtom);
  const [spots, setSpots] = useAtom(spotsAtom);
  const [roads, setRoads] = useAtom(roadsAtom);
  const { lobbyState } = useLobbyState();
  const isPlaying = sm.getSocketId() === lobbyState.currentPlayer;
  const { availableActions } = useAvailableActions();

  // init board tiles and stuff
  useEffect(() => {
    const boardTiles = JSON.parse(lobbyState.boardState?.tiles as string);
    const spots = JSON.parse(lobbyState.boardState?.spots as string);
    const roads = JSON.parse(lobbyState.boardState?.roads as string);
    setTiles(Object.values(boardTiles));
    setSpots(Object.values(spots));
    setRoads(Object.values(roads));
    console.log('Board updated.');
  }, [lobbyState.boardState?.roads, lobbyState.boardState?.spots]);

  const getPlayer = (player: string): Player => {
    const pg = lobbyState.players.find((el) => {
      return el.socketId === player;
    });
    return pg
      ? pg
      : ({
          username: 'undefined?',
          socketId: '',
          color: 'white',
        } as Player);
  };

  const onSpawnableClicked = (
    event: GameAction,
    data:
      | ClientPayloads[GameAction.ActionSetupSettlement]
      | ClientPayloads[GameAction.ActionSetupRoad]
  ) => {
    console.log(event, data);
    sm.emit({
      event,
      data,
    });
  };

  const canSpawnSpot =
    isPlaying &&
    availableActions.availableActions.includes(
      GameAction.ActionSetupSettlement
    );
  const canSpawnRoad =
    isPlaying &&
    availableActions.availableActions.includes(GameAction.ActionSetupRoad);

  useEffect(() => {
    const onDeltaUpdate = (data: ServerPayloads[ServerEvents.DeltaUpdate]) => {
      for (const update of data) {
        if (update) {
          const player = getPlayer(update.player as string);
          const action = update.action;

          // notify players. TODO: not everything
          showNotification({
            message: `${player.username} performed ${action}`,
            color: player.color,
          });

          if (action === GameAction.ActionSetupSettlement) {
            const details =
              update.details as DeltaDetail[GameAction.ActionSetupSettlement];

            setSpots((prevSpots) =>
              prevSpots.map((spot) =>
                spot.id === details.newSettlement
                  ? { ...spot, owner: player.socketId as string }
                  : spot
              )
            );
          } else if (update?.action === GameAction.ActionSetupRoad) {
            const details =
              update.details as DeltaDetail[GameAction.ActionSetupRoad];

            setRoads((prevRoads) =>
              prevRoads.map((road) =>
                road.id === details.newRoad.id
                  ? { ...road, owner: player.socketId as string }
                  : road
              )
            );
          }
        }
      }
    };

    sm.registerListener(ServerEvents.DeltaUpdate, onDeltaUpdate);

    return () => {
      sm.removeListener(ServerEvents.DeltaUpdate, onDeltaUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <group name="tiles" key="tiles">
        {tiles.map((tileData, index) => {
          const TileComponent = resourceToModel[tileData.resource];
          const position: Vector3 = [
            tileData.position.screen.x,
            0,
            tileData.position.screen.z,
          ];
          return <TileComponent key={index} position={position} />;
        })}
      </group>

      {/* Towns, cities, and roads */}
      {/* Shouldnt cause many re-renders but lets see */}
      <group name="spots" key="spots">
        {spots.map((spotData, index) => {
          // if can be built by this player
          const spawnable =
            canSpawnSpot && spotData.settlementType !== 'unbuildable';
          availableActions.buildableSpots?.includes(spotData.id);
          const renderable = spotData.owner !== null;
          if (renderable) console.log(spotData.id);

          if (!spawnable && !renderable) return null;
          return spotRender(spotData, index, onSpawnableClicked, getPlayer);
        })}
      </group>
      <group name="roads" key="roads">
        {roads.map((roadData, index) => {
          // if can be built by this player
          const spawnable =
            canSpawnRoad &&
            availableActions.buildableRoads?.includes(roadData.id);
          const renderable = roadData.owner !== null;

          if (!spawnable && !renderable) return null;
          return roadRender(roadData, index, onSpawnableClicked, getPlayer);
        })}
      </group>
    </>
  );
};

export default Board;

{
  /* <Annotation
  color={'red'}
  position={position}
  text={tileData.id}
/> */
}

// todo: instead of having everything under spots, also because later in the game they become useless, have separate lists for spots and towns
