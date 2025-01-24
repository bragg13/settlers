import { Box } from '@react-three/drei';
import { JSX } from 'react/jsx-runtime';

export function Road3D(props) {
  return (
    <Box rotation-y={props.yangle} {...props} scale={[0.3, 0.1, 0.05]}>
      <meshStandardMaterial color={props.color} />
    </Box>
  );
}

// TODO
// jeasing to move camera to spot selected when deciding where to build smth
// show models based on game state (placeIniitalSettlments, ...)
// show numbers values on top of tiles
