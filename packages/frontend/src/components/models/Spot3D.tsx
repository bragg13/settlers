import { Sphere } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import { ClientPayloads, GameAction, Road, Spot } from '@settlers/shared';

export function Spot3D(props: Spot3DProps) {
  const alpha = 1.0;
  // TODO: check if this is even slightly feasible lol
  // i feel like this is a LOT to allocate
  return (
    <Sphere
      onClick={() =>
        props.onClicked(GameAction.ActionSetupSettlement, {
          spotId: props.spotData.id,
        })
      }
      position={props.position}
      scale={[0.1, 0.1, 0.1]}
    >
      <meshStandardMaterial color={props.color} transparent opacity={alpha} />
    </Sphere>
  );
}

interface Spot3DProps {
  spotData: Spot;
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
