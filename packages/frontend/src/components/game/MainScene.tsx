import { useControls } from 'leva';
import Board from './Board';
import { Sea } from '../models/Sea';
import { Road3D } from '../models/Road3D';

const MainScene = () => {
  // leva controls
  const directionalLight = useControls('directionalLight', {
    x: { value: 10, min: -10, max: 10, step: 0.01 },
    y: { value: 8, min: -10, max: 10, step: 0.01 },
    z: { value: 8, min: -10, max: 10, step: 0.01 },
    intensity: { value: 3.14, min: 0, max: 10, step: 0.01 },
  });
  // add tile animation on turn pass, like every hexagon tile rotates 90 degrees tbi

  return (
    <>
      <Sea />
      <directionalLight
        position={[directionalLight.x, directionalLight.y, directionalLight.z]}
        intensity={directionalLight.intensity}
      />
      <Board />
    </>
  );
};

export default MainScene;
