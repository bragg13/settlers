import { Sphere } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import { ClientPayloads, GameAction, Spot } from '@settlers/shared';
import { useRef } from 'react';
import { Mesh } from 'three';
import { animated, useSpring } from '@react-spring/three';

export function Spot3D(props: Spot3DProps) {
  // a spot is visible if it's about to be selected, or if it had an owner
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
    <Sphere
      ref={meshRef}
      onClick={() =>
        props.onClicked(GameAction.ActionSetupSettlement, {
          spotId: props.spotData.id,
        })
      }
      position={props.position}
      scale={[0.1, 0.1, 0.1]}
    >
      <animated.meshStandardMaterial
        color="white"
        transparent
        opacity={springs.alpha}
      />
    </Sphere>
  );
}

interface Spot3DProps {
  spotData: Spot;
  position?: Vector3;
  selectable: boolean;
  onClicked: (
    event: GameAction,
    data:
      | ClientPayloads[GameAction.ActionSetupSettlement]
      | ClientPayloads[GameAction.ActionSetupRoad]
  ) => void;
}
