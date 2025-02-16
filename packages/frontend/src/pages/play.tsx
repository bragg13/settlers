import { Button, Stack, Typography } from '@mui/material';
import { useSocketManager } from '../hooks/useSocketManager';
import { Canvas } from '@react-three/fiber';
import { ClientEvents, GameAction } from '@settlers/shared';
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
      <Canvas
        dpr={[1, 2]} // Limit pixel ratio
        performance={{ min: 0.5 }} // Allow frame drops
        frameloop="demand" // Only render when needed
        gl={{
          powerPreference: 'high-performance',
          antialias: false, // Disable antialiasing in dev
        }}
        camera={{ position: [0, 1.5, 2.5] }}
      >
        <MainScene />
        <Stats />
        {/* <axesHelper args={[15]} /> */}
        <OrbitControls />
        {/* <gridHelper /> */}
      </Canvas>

      <Stack direction="row" gap={4}>
        <Typography
          sx={{
            borderBottom: '3px solid',
            alignContent: 'end',
            borderColor: playerInformation.color,
          }}
        >
          {playerInformation.username}
        </Typography>
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
          dice
        </Button>
        <Button
          id="saveGame"
          variant="contained"
          color="info"
          // will be disabled if you are not the owner of the game i guess
          onClick={() => {
            sm.emit({ event: ClientEvents.SaveGame });
          }}
        >
          save
        </Button>
        <Button
          id="loadGame"
          variant="contained"
          color="info"
          // will be disabled if you are not the owner of the game i guess
          onClick={() => {
            const path = prompt(
              'path:',
              '/Users/andrea/Desktop/settlers/saves/game123.json'
            );
            sm.emit({ event: ClientEvents.LoadGame, data: { path } });
          }}
        >
          load
        </Button>
      </Stack>
      {/* <Chat /> */}
    </>
  );
};

export default PlayPage;
