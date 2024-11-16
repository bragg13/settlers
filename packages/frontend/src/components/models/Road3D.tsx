import { Box } from '@react-three/drei';

export function Road3D(props) {
  return (
    <Box {...props} scale={[0.4, 0.1, 0.1]}>
      <meshStandardMaterial color={'white'} />
    </Box>
  );
}
