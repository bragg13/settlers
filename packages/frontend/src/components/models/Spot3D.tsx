import { Sphere } from '@react-three/drei';
import { useLobbyState } from '../game/GameContext';
import { Vector3 } from '@react-three/fiber';
import { GameAction, Spot } from '@settlers/shared';
import { useState } from 'react';
import { useSocketManager } from '../../hooks/useSocketManager';

export function Spot3D(props: Spot3DProps) {
  const alpha = 1.0;
  const [scaleCoeff, setScaleCoeff] = useState(1.0);
  // TODO: check if this is even slightly feasible lol
  // i feel like this is a LOT to allocate
  const sm = useSocketManager();

  const onSpotClicked = () => {
    sm.emit({
      event: GameAction.ActionSetupSettlement,
      data: {
        spotId: props.spotData.id,
      },
    });
  };

  const onSpotEnter = () => {
    if (!props.clickable) return;
    setScaleCoeff(1.5);
    console.log(`enter spot ${props.spotData.id}`);
  };
  const onSpotLeave = () => {
    if (!props.clickable) return;
    setScaleCoeff(1.0);
    console.log(`exit spot ${props.spotData.id}`);
  };

  return (
    <Sphere
      onClick={onSpotClicked}
      onPointerEnter={onSpotEnter}
      onPointerLeave={onSpotLeave}
      position={props.position}
      scale={[0.1 * scaleCoeff, 0.1 * scaleCoeff, 0.1 * scaleCoeff]}
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
}
