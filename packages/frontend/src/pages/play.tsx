import { Button, Stack, Typography } from '@mui/material';
import { useSocketManager } from '../hooks/useSocketManager';
import { Canvas } from '@react-three/fiber';
import { GameAction } from '@settlers/shared';
import {
  useAvailableActions,
  useLobbyState,
  usePlayerInformation,
} from '../components/game/GameContext';
import Chat from '../components/ui/chat';
import MainScene from '../components/game/MainScene';
import { Stats, OrbitControls, Environment } from '@react-three/drei';

const PlayPage = () => {
  const { playerInformation } = usePlayerInformation();
  const { lobbyState } = useLobbyState();
  const { availableActions } = useAvailableActions();
  const sm = useSocketManager();
  const isPlaying = sm.getSocketId() === lobbyState.currentPlayer;

  return (
    <>
      <Canvas camera={{ position: [0, 1.5, 2.5] }}>
        <MainScene />
        <Stats />
        <axesHelper />
        <OrbitControls />
        <gridHelper />
      </Canvas>

      <Stack direction="row" gap={4}>
        <Typography sx={{ backgroundColor: playerInformation.color }}>
          {playerInformation.username}
        </Typography>
        <Button
          id="buildSettelment"
          variant="contained"
          color="primary"
          disabled={
            !isPlaying ||
            !availableActions.availableActions.includes(
              GameAction.ActionSetupSettlement
            )
          }
          onClick={() => {
            sm.emit({
              event: GameAction.ActionSetupSettlement,
              data: {
                spotId: 1,
              },
            });
          }}
        >
          build settlement
        </Button>

        <Button
          id="buildRoad"
          disabled={
            !isPlaying ||
            !availableActions.availableActions.includes(
              GameAction.ActionSetupRoad
            )
          }
          variant="contained"
          color="primary"
          onClick={() => {
            sm.emit({
              event: GameAction.ActionSetupRoad,
              data: { spot1: 1, spot2: 5, roadId: 2 },
            });
          }}
        >
          build road
        </Button>
        <Button
          id="rollDice"
          variant="contained"
          color="primary"
          disabled={
            !isPlaying ||
            !availableActions.availableActions.includes(
              GameAction.ActionDiceRoll
            )
          }
          onClick={() => {
            sm.emit({ event: GameAction.ActionDiceRoll, data: {} });
          }}
        >
          roll dice
        </Button>
      </Stack>
      {/* <Chat /> */}
    </>
  );
};

export default PlayPage;
