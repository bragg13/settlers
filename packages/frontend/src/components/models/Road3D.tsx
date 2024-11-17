import { Box } from '@react-three/drei';
import { useControls } from 'leva';
import { useRef } from 'react';

export function Road3D(props) {
  const ref = useRef(null);

  return (
    <Box rotation-y={props.yangle} {...props} scale={[0.2, 0.1, 0.1]}>
      <meshStandardMaterial color={'white'} />
    </Box>
  );
}
