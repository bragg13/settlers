import { Box } from '@react-three/drei';
import { JSX } from 'react/jsx-runtime';
import { useSocketManager } from '../../hooks/useSocketManager';
import { ClientPayloads, GameAction, Road, Spot } from '@settlers/shared';
import { Vector3 } from '@react-three/fiber';
import { useRef } from 'react';
import { animated, useSpring } from '@react-spring/three';

export function Road3D(props: Road3DProps) {
  // a road is visible if it's about to be selected, or if it had an owner
  const meshRef = useRef<Mesh>(null!);
  const springs = useSpring({
    from: {
      alpha: 0.2,
    },
    to: [{ alpha: 0.9 }, { alpha: 0.2 }],
    config: {
      mass: 2,
      tnsion: 170,
      friction: 60,
      duration: 1500,
      clamp: true,
    },
    loop: true,
  });
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
      scale={[0.35, 0.1, 0.065]}
    >
      {props.roadData.owner === null ? (
        <animated.meshStandardMaterial
          color="white"
          transparent
          opacity={springs.alpha}
        />
      ) : (
        <meshStandardMaterial color={props.color} transparent opacity={1} />
      )}
    </Box>
  );
}

interface Road3DProps {
  roadData: Road;
  color: string;
  position?: Vector3;
  selectable: boolean;
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
