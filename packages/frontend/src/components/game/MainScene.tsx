import { useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import { useRef } from 'react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

function Box(props) {
  const ref = useRef();
  useFrame((_, delta) => {
    ref.current.rotation.x += 1 * delta;
  });

  return (
    <mesh {...props} ref={ref}>
      <boxGeometry />
      <meshBasicMaterial color={0x00ff00} />
    </mesh>
  );
}

const MainScene = () => {
  const sheepTileModel = useLoader(GLTFLoader, '/models/sheep.glb');

  // leva controls
  const tilePosition = useControls('SheepTile', {
    x: { value: 0, min: -10, max: 10, step: 0.01 },
    y: { value: 0, min: -10, max: 10, step: 0.01 },
    z: { value: 0, min: -10, max: 10, step: 0.01 },
  });

  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={0.1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <primitive
        object={sheepTileModel.scene}
        position={[tilePosition.x, tilePosition.y, tilePosition.z]}
        children-0-castShadow
      />
    </>
  );
};

export default MainScene;
