// can be town or city

import { Cone, Sphere } from '@react-three/drei';
import { useFrame, Vector3 } from '@react-three/fiber';
import { ClientPayloads, GameAction, Road, Spot } from '@settlers/shared';
import { useRef } from 'react';
import { Mesh, MeshStandardMaterial } from 'three';
import { animated, useSpring } from '@react-spring/three';

export function Town3D(props: Town3DProps) {
  return (
    <Cone position={props.position} scale={[0.1, 0.1, 0.1]}>
      <meshStandardMaterial color={props.color} transparent opacity={1} />
    </Cone>
  );
}

interface Town3DProps {
  spotData: Spot;
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
