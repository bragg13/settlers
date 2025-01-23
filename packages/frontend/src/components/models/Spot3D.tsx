import { Sphere } from '@react-three/drei';
import { useLobbyState } from '../game/GameContext';

export function Spot3D(props) {
  const alpha = props.owner ? 1.0 : 0.8;

  return (
    <Sphere {...props} scale={[0.1, 0.1, 0.1]}>
      <meshStandardMaterial color={props.color} opacity={alpha} />
    </Sphere>
  );
}
