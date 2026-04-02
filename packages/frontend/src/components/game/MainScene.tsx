import { useControls } from 'leva';
import * as THREE from 'three';
import Board from './Board';
import { Sea } from '../models/Sea';
import { Road3D } from '../models/Road3D';

const MainScene = () => {
  // leva controls
  // const directionalLight = useControls('directionalLight', {
  //   x: { value: 10, min: -10, max: 10, step: 0.01 },
  //   y: { value: 8, min: -10, max: 10, step: 0.01 },
  //   z: { value: 8, min: -10, max: 10, step: 0.01 },
  //   intensity: { value: 3.14, min: 0, max: 10, step: 0.01 },
  // });
  // add tile animation on turn pass, like every hexagon tile rotates 90 degrees tbi

  return (
    <>
      <color attach="background" args={['#87CEEB']} />
      <fog attach="fog" args={['#87CEEB', 90, 120]} />
      <mesh>
        <sphereGeometry args={[500, 32, 32]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} />
      </mesh>
      <Sea />
      <directionalLight position={[10, 8, 8]} intensity={3.14} />
      <Board />
    </>
  );
};

export default MainScene;
