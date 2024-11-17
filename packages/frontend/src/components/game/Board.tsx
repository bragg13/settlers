import { useEffect, useRef, useState } from 'react';
import { useSocketManager } from '../../hooks/useSocketManager';
import {
  Delta,
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

type Tile3D =
  | typeof Clay3DTile
  | typeof Robbers3DTile
  | typeof Rocks3DTile
  | typeof Sheep3DTile
  | typeof Wheat3DTile
  | typeof Wood3DTile;

const Board = (props) => {
  const sm = useSocketManager();
  const [deltaUpdate, setDeltaUpdate] = useState<Delta>(null);

  useEffect(() => {
    const onDeltaUpdate = (data: ServerPayloads[ServerEvents.DeltaUpdate]) => {
      for (const update of data) {
        // TBI
        console.log(
          `player ${update?.player} has performed action ${update?.action}`
        );
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
  const ref = useRef();
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const { lobbyState } = useLobbyState();

  useEffect(() => {
    if (tiles.length === 0) {
      const boardTiles = JSON.parse(lobbyState.boardState.tiles);
      const spots = JSON.parse(lobbyState.boardState.spots);
      const roads = JSON.parse(lobbyState.boardState.roads);
      setTiles(Object.values(boardTiles));
      setSpots(Object.values(spots));
      setRoads(Object.values(roads));
    }
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
            <Spot3D key={index} position={position} spotId={spotData.id} />
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
          console.log(roadData);
          return (
            <Road3D
              key={index}
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
