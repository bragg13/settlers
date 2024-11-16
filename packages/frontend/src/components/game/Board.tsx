import { useEffect, useRef, useState } from 'react';
import { useSocketManager } from '../../hooks/useSocketManager';
import {
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

  // for (let el of board) {
  //       coords.x = hexCoords[el.id].x;
  //       coords.z = hexCoords[el.id].z;

  //       // tile
  //       currentResource = board[index].resource;
  //       let model = this.loadedModels[currentResource].clone();
  //       model.position.set(coords.x, 0, coords.z);
  //       model.receiveShadow = true;
  //       model.name = `tile_${el.id}`;

  //       // add tile animation on turn pass, like every hexagon tile rotates 90 degrees tbi

  //       // add tile harvest animation
  //       model.harvestAnim = () => {
  //         gsap.to(model.position, {
  //           duration: 0.5,
  //           y: "+=1",
  //           onComplete: () => {
  //             gsap.to(model.position, {
  //               duration: 0.5,
  //               y: "-=1",
  //             });
  //           },
  //         });

  //         // scale animation
  //         gsap.to(model.scale, {
  //           duration: 0.5,
  //           x: "+=0.2",
  //           y: "+=0.2",
  //           z: "+=0.2",
  //           onComplete: () => {
  //             gsap.to(model.scale, {
  //               duration: 0.5,
  //               x: "-=0.2",
  //               y: "-=0.2",
  //               z: "-=0.2",
  //             });
  //           },
  //         });
  //       };

  //       // value text
  //       currentValue = `num_${board[index].value}`;
  //       if (currentValue !== "num_7") {
  //         let text = this.loadedModels[currentValue].clone();

  //         text.name = "value_text";
  //         text.scale.set(0.3, 0.3, 0.3);
  //         text.material = new THREE.MeshPhongMaterial({
  //           color:
  //             currentValue === "num_8" || currentValue === "num_6"
  //               ? 0xff0000
  //               : 0xdddddd,
  //         });
  //         text.castShadow = true;
  //         text.receiveShadow = true;

  //         // text bouncing animation
  //         text.bounceAnim = () => {
  //           gsap.to(text.position, {
  //             duration: 4,
  //             y: "+=0.1",
  //             yoyo: true,
  //             repeat: -1,
  //           });
  //         };

  //         // make the text always rotate on its y axis
  //         text.position.set(0, 0.4, 0);
  //         model.add(text);
  //position={[tileData.position.x, 0, tileData.position.z]}

  return (
    <>
      <Sea />
      <group name="tiles">
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
      {/* <group name="roads">
        {roads.map((roadData, index) => {
          const position: Vector3 = [
            roadData.position.screen.x,
            roadData.position.screen.y,
            roadData.position.screen.z,
          ];
          return <Road3D key={index} position={position} />;
        })}
      </group> */}
    </>
  );
};

export default Board;
