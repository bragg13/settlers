import { useEffect, useRef, useState } from 'react';
import { useSocketManager } from '../../hooks/useSocketManager';
import {
  GameAction,
  Player,
  ServerEvents,
  ServerPayloads,
} from '@settlers/shared';
import { useLobbyState } from './GameContext';
import { Vector3 } from '@react-three/fiber';
import { Spot3D } from '../models/Spot3D';
import { Road3D } from '../models/Road3D';
import { useAtom } from 'jotai';
import { roadsAtom, spotsAtom, tilesAtom } from '../atoms';
import { showNotification } from '@mantine/notifications';
import { DeltaDetail } from 'packages/shared/src/lib/common/BoardTypes';
import { resourceToModel } from './types';

const Board = (props) => {
  const sm = useSocketManager();
  const [tiles, setTiles] = useAtom(tilesAtom);
  const [spots, setSpots] = useAtom(spotsAtom);
  const [roads, setRoads] = useAtom(roadsAtom);
  const { lobbyState } = useLobbyState();

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
      <group name="spots" key="spots">
        {spots.map((spotData, index) => {
          const position: Vector3 = [
            spotData.position.screen.x,
            spotData.position.screen.y,
            spotData.position.screen.z,
          ];

          return (
            <Spot3D
              key={index}
              color={getPlayer(spotData.owner as string).color}
              owner={spotData.owner}
              type={spotData.settlementType}
              position={position}
            />
          );
        })}
      </group>
      <group name="roads" key="roads">
        {roads.map((roadData, index) => {
          const position: Vector3 = [
            roadData.position.screen.x,
            roadData.position.screen.y,
            roadData.position.screen.z,
          ];
          return (
            <Road3D
              key={index}
              color={getPlayer(roadData.owner as string).color}
              yangle={roadData.position.screen.yangle}
              position={position}
            />
          );
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
