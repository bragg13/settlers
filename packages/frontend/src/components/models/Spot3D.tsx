import { Sphere } from '@react-three/drei';
import { Annotation } from '../tiles/TileValue';

export function Spot3D(props) {
  return (
    <>
      <Annotation
        color={'black'}
        position={[...props.position]}
        text={props.spotId}
      />
      <Sphere {...props} scale={[0.1, 0.1, 0.1]}>
        <meshStandardMaterial color={'white'} />
      </Sphere>
    </>
  );
}
