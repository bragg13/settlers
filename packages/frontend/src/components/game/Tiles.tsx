import { useEffect, useRef, useState } from 'react';
import { useSocketManager } from '../../hooks/useSocketManager';
import { ServerEvents, ServerPayloads, Tile } from '@settlers/shared';
import { Clay3DTile } from '../tiles/Clay';
import { Robbers3DTile } from '../tiles/Robbers';
import { Rocks3DTile } from '../tiles/Rocks';
import { Sheep3DTile } from '../tiles/Sheep';
import { Wheat3DTile } from '../tiles/Wheat';
import { Wood3DTile } from '../tiles/Wood';
import { useLobbyState } from './GameContext';
import { Vector3 } from '@react-three/fiber';

type Tile3D =
  | typeof Clay3DTile
  | typeof Robbers3DTile
  | typeof Rocks3DTile
  | typeof Sheep3DTile
  | typeof Wheat3DTile
  | typeof Wood3DTile;

const Tiles = (props) => {
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

  const { lobbyState } = useLobbyState();

  useEffect(() => {
    if (tiles.length === 0) {
      const boardTiles = JSON.parse(lobbyState.boardState.tiles);
      setTiles(Object.values(boardTiles));
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
    <group name="tiles">
      {tiles.map((tileData, index) => {
        const TileComponent = resourceToModel[tileData.resource];
        const position: Vector3 = [tileData.position.x, 0, tileData.position.z];
        return <TileComponent key={index} position={position} />;
      })}
    </group>
  );
};

export default Tiles;
