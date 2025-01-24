import { useEffect, useRef, useState } from 'react';
import { useSocketManager } from '../../hooks/useSocketManager';
import {
  ClientEvents,
  Delta,
  GameAction,
  Player,
  Road,
  ServerEvents,
  ServerPayloads,
  Spot,
  Tile,
} from '@settlers/shared';
import { Clay3DTile } from '../tiles/Clay';
import { Robbers3DTile } from '../tiles/Robbers';
import { Rocks3DTile } from '../tiles/Rocks';
import { Sheep3DTile } from '../tiles/Sheep';
import { Wheat3DTile } from '../tiles/Wheat';
import { Wood3DTile } from '../tiles/Wood';
import { useLobbyState } from './GameContext';
import { Vector3 } from '@react-three/fiber';
import { Spot3D } from '../models/Spot3D';
import { Box, Plane } from '@react-three/drei';
import { Sea } from '../models/Sea';
import { Road3D } from '../models/Road3D';
import { Annotation } from '../tiles/TileValue';
import { useControls } from 'leva';
import LobbyPage from '../../pages/lobby';
import { useAtom } from 'jotai';
import { roadsAtom, spotsAtom, tilesAtom } from '../atoms';
import { showNotification } from '@mantine/notifications';
import { DeltaDetail } from 'packages/shared/src/lib/common/BoardTypes';

type Tile3D =
  | typeof Clay3DTile
  | typeof Robbers3DTile
  | typeof Rocks3DTile
  | typeof Sheep3DTile
  | typeof Wheat3DTile
  | typeof Wood3DTile;

const Board = (props) => {
  const sm = useSocketManager();
  const [tiles, setTiles] = useAtom(tilesAtom);
  const [spots, setSpots] = useAtom(spotsAtom);
  const [roads, setRoads] = useAtom(roadsAtom);
  const { lobbyState } = useLobbyState();

  const getPlayer = (player: string): Player => {
    const pg = lobbyState.players.find((el) => {
      return el.socketId === player;
    });
    return pg!;
  };

  useEffect(() => {
    const onDeltaUpdate = (data: ServerPayloads[ServerEvents.DeltaUpdate]) => {
      for (const update of data) {
        if (update) {
          console.log(update);
          const player = getPlayer(update.player as string);
          const action = update.action
          const details = update.details as DeltaDetail[typeof action]

          // notify players. TODO: not everything
          showNotification({
            message: `${player.username} performed ${action}`,
            color: player.color,
          });

          if (action === GameAction.ActionSetupSettlement) {
            setSpots((prevSpots) =>
              prevSpots.map((spot) =>
                spot.id === details. { ...spot, owner: update.player } : spot
              )
            );
          } else if (update?.action === GameAction.ActionSetupRoad) {
            // Update roads state
            setRoads((prevRoads) => [
              ...prevRoads,
              {
                id: update.roadId,
                owner: update.player,
                position: update.position,
              },
            ]);
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

  const resourceToModel = {
    WOOD: Wood3DTile,
    BRICK: Clay3DTile,
    ROBBERS: Robbers3DTile,
    ORE: Rocks3DTile,
    SHEEP: Sheep3DTile,
    WHEAT: Wheat3DTile,
  };

  useEffect(() => {
    const fetchBoard = () => {
      const boardTiles = JSON.parse(lobbyState.boardState?.tiles as string);
      const spots = JSON.parse(lobbyState.boardState?.spots as string);
      const roads = JSON.parse(lobbyState.boardState?.roads as string);
      setTiles(Object.values(boardTiles));
      setSpots(Object.values(spots));
      setRoads(Object.values(roads));
    };

    fetchBoard();
  }, [lobbyState]);

  return (
    <>
      <group name="tiles">
        {tiles.map((tileData, index) => {
          const TileComponent = resourceToModel[tileData.resource];
          const position: Vector3 = [
            tileData.position.screen.x,
            0,
            tileData.position.screen.z,
          ];
          return (
            <>
              {/* <Annotation
                color={'red'}
                position={position}
                text={tileData.id}
              /> */}
              <TileComponent key={index} position={position} />;
            </>
          );
        })}
      </group>
      <group name="spots">
        {spots.map((spotData, index) => {
          const position: Vector3 = [
            spotData.position.screen.x,
            spotData.position.screen.y,
            spotData.position.screen.z,
          ];

          return (
            <>
              {/* <Annotation
                color={'red'}
                position={position}
                text={tileData.id}
              /> */}
              <Spot3D
                key={index}
                color={getPlayer(spotData.owner as string).color}
                owner={spotData.owner}
                type={spotData.settlementType}
                position={position}
              />
            </>
          );
        })}
      </group>
      <group name="roads">
        {roads.map((roadData, index) => {
          const position: Vector3 = [
            roadData.position.screen.x,
            roadData.position.screen.y,
            roadData.position.screen.z,
          ];
          // console.log(roadData);
          return (
            <>
              {/* <Annotation
                color={'red'}
                position={position}
                text={tileData.id}
              /> */}
              <Road3D
                key={index}
                yangle={roadData.position.screen.yangle}
                position={position}
              />
            </>
          );
        })}
      </group>
    </>
  );
};

export default Board;
