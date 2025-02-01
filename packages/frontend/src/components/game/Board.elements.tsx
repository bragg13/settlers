import { Vector3 } from '@react-three/fiber';
import {
  ClientPayloads,
  GameAction,
  Player,
  Road,
  Spot,
} from '@settlers/shared';
import { Spot3D } from '../models/Spot3D';
import { Road3D } from '../models/Road3D';
import { Town3D } from '../models/Town3D';

export const spotRender = (
  spotData: Spot,
  index: number,
  onClicked: (
    event: GameAction,
    data:
      | ClientPayloads[GameAction.ActionSetupSettlement]
      | ClientPayloads[GameAction.ActionSetupRoad]
  ) => void,
  getPlayer: (player: string) => Player
) => {
  const coneOffset = spotData.owner !== null ? 0.05 : 0;
  const selectable = true;
  const position: Vector3 = [
    spotData.position.screen.x,
    spotData.position.screen.y + coneOffset,
    spotData.position.screen.z,
  ];

  return spotData.owner !== null ? (
    <Town3D
      key={index}
      color={getPlayer(spotData.owner as string).color}
      spotData={spotData}
      position={position}
      selectable={selectable}
      onClicked={onClicked}
    />
  ) : (
    <Spot3D
      key={index}
      spotData={spotData}
      position={position}
      selectable={selectable}
      onClicked={onClicked}
    />
  );
};

export const roadRender = (
  roadData: Road,
  index: number,
  onClicked: (
    event: GameAction,
    data:
      | ClientPayloads[GameAction.ActionSetupSettlement]
      | ClientPayloads[GameAction.ActionSetupRoad]
  ) => void,
  getPlayer: (player: string) => Player
) => {
  const position: Vector3 = [
    roadData.position.screen.x,
    roadData.position.screen.y,
    roadData.position.screen.z,
  ];
  const selectable = true;
  return (
    <Road3D
      key={index}
      color={getPlayer(roadData.owner as string).color}
      roadData={roadData}
      position={position}
      selectable={selectable}
      onClicked={onClicked}
    />
  );
};
