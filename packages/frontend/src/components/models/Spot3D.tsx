import { Sphere } from '@react-three/drei';

export function Spot3D(props) {
  return (
    <Sphere {...props} scale={[0.1, 0.1, 0.1]}>
      <meshStandardMaterial color={'white'} />
    </Sphere>
  );
}
