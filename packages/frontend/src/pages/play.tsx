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
import { OrbitControls } from '@react-three/drei';

const PlayPage = () => {
  const { playerInformation } = usePlayerInformation();
  const { lobbyState } = useLobbyState();
  const { availableActions } = useAvailableActions();
  const sm = useSocketManager();
  const isPlaying = sm.getSocketId() === lobbyState.currentPlayer;

  return (
    <>
      <Typography
        variant="overline"
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      >
        Settlers of Catan - 3D remix
      </Typography>
      <Stack direction="row" gap={4}>
        {/* username */}
        <Typography
          sx={{
            borderBottom: '3px solid',
            alignContent: 'end',
            borderColor: playerInformation.color,
          }}
        >
          {playerInformation.username}
        </Typography>

        {/* inventory */}
        <Typography variant="caption">
          🌲 WOOD: {playerInformation.resources?.WOOD}
        </Typography>
        <Typography variant="caption">
          🌾 WHEAT: {playerInformation.resources?.WHEAT}
        </Typography>
        <Typography variant="caption">
          🐑 SHEEP: {playerInformation.resources?.SHEEP}
        </Typography>
        <Typography variant="caption">
          ⛏️ ORE: {playerInformation.resources?.ORE}
        </Typography>
        <Typography variant="caption">
          🧱 BRICK: {playerInformation.resources?.BRICK}
        </Typography>
      </Stack>
      <Canvas
        // dpr={[1, 2]} // Limit pixel ratio
        performance={{ min: 0.5 }} // Allow frame drops
        frameloop="demand" // Only render when needed
        style={{ margin: '5px', height: '90%', border: '2px solid lightgrey' }}
        gl={{
          powerPreference: 'high-performance',
          antialias: true, // Disable antialiasing in dev
        }}
        camera={{ position: [0, 1.5, 2.5] }}
      >
        <MainScene />
        <OrbitControls />
      </Canvas>

      <Stack direction="row" gap={4}>
        <Button
          id="rollDice"
          variant="outlined"
          color="info"
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
          🎲
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
