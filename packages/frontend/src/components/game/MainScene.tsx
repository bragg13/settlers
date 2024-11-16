import { useControls } from 'leva';
import { useEffect } from 'react';
import { useSocketManager } from '../../hooks/useSocketManager';
import { Delta, ServerEvents, ServerPayloads } from '@settlers/shared';
import Tiles from './Tiles';

const MainScene = () => {
  const sm = useSocketManager();

  useEffect(() => {
    const onDeltaUpdate = (data: ServerPayloads[ServerEvents.DeltaUpdate]) => {
      for (const update of data) {
        // TBI
        console.log(
          `player ${update.player} has performed action ${update.action}`
        );
        // applyDeltaUpdate(update);
      }
    };

    sm.registerListener(ServerEvents.DeltaUpdate, onDeltaUpdate);

    return () => {
      sm.removeListener(ServerEvents.DeltaUpdate, onDeltaUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // leva controls
  const directionalLight = useControls('directionalLight', {
    x: { value: 10, min: -10, max: 10, step: 0.01 },
    y: { value: 8, min: -10, max: 10, step: 0.01 },
    z: { value: 8, min: -10, max: 10, step: 0.01 },
    intensity: { value: 3.14, min: 0, max: 10, step: 0.01 },
  });

  // add tile animation on turn pass, like every hexagon tile rotates 90 degrees tbi

  return (
    <>
      <directionalLight
        position={[directionalLight.x, directionalLight.y, directionalLight.z]}
        intensity={directionalLight.intensity}
      />
      <Tiles />
    </>
  );
};

export default MainScene;
