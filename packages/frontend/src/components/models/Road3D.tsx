import { Box } from '@react-three/drei';
import { JSX } from 'react/jsx-runtime';

export function Road3D(props: JSX.IntrinsicAttributes) {
  return (
    <Box rotation-y={props.yangle} {...props} scale={[0.3, 0.1, 0.05]}>
      <meshStandardMaterial color={'white'} />
    </Box>
  );
}
