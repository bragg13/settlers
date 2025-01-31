import { Box } from '@react-three/drei';
import { JSX } from 'react/jsx-runtime';
import { useSocketManager } from '../../hooks/useSocketManager';
import { ClientPayloads, GameAction, Road, Spot } from '@settlers/shared';
import { Vector3 } from '@react-three/fiber';

export function Road3D(props: Road3DProps) {
  return (
    <Box
      onClick={() =>
        props.onClicked(GameAction.ActionSetupRoad, {
          roadId: props.roadData.id,
          spot1: props.roadData.position.board.from,
          spot2: props.roadData.position.board.to,
        })
      }
      position={props.position}
      rotation-y={props.roadData.position.screen.yangle}
      scale={[0.3, 0.1, 0.05]}
    >
      <meshStandardMaterial color={props.color} />
    </Box>
  );
}

interface Road3DProps {
  roadData: Road;
  color: string;
  position?: Vector3;
  clickable: boolean;
  onClicked: (
    event: GameAction,
    data:
      | ClientPayloads[GameAction.ActionSetupSettlement]
      | ClientPayloads[GameAction.ActionSetupRoad]
  ) => void;
}
// TODO
// jeasing to move camera to spot selected when deciding where to build smth
// show models based on game state (placeIniitalSettlments, ...)
// show numbers values on top of tiles
