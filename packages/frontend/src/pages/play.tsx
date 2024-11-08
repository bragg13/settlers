import { Button, Stack, TextField, Typography } from '@mui/material';
import { useSocketManager } from '../hooks/useSocketManager';
import {
  ClientEvents,
  GameAction,
  ServerEvents,
  ServerPayloads,
} from '@settlers/shared';
import { useEffect, useState } from 'react';
import {
  useLobbyState,
  usePlayerInformation,
} from '../components/game/GameContext';

const PlayPage = () => {
  const [msg, setMsg] = useState('');
  const { playerInformation } = usePlayerInformation();
  const { lobbyState } = useLobbyState();
  const sm = useSocketManager();
  const isPlaying = sm.getSocketId() === lobbyState.currentPlayer;

  useEffect(() => {
    const onDeltaUpdate = (data: ServerPayloads[ServerEvents.DeltaUpdate]) => {
      for (const update of data) {
        console.log(
          `player ${update.player} has performed action ${update.action}`
        );
      }
    };

    sm.registerListener(ServerEvents.DeltaUpdate, onDeltaUpdate);

    return () => {
      sm.removeListener(ServerEvents.DeltaUpdate, onDeltaUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction="row" gap={4}>
      <Typography sx={{ backgroundColor: playerInformation.color }}>
        {playerInformation.username}
      </Typography>
      <Button
        id="buildSettelment"
        variant="contained"
        color="primary"
        disabled={!isPlaying}
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
        disabled={!isPlaying}
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
        disabled={!isPlaying}
        onClick={() => {
          sm.emit({ event: GameAction.ActionDiceRoll, data: {} });
        }}
      >
        roll dice
      </Button>
      <Stack>
        <TextField
          variant="standard"
          margin="normal"
          id="msg"
          label="message"
          name="msg"
          value={msg}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.preventDefault();
            setMsg(e.target.value);
          }}
        />
        <Button
          id="chat"
          variant="contained"
          color="primary"
          onClick={() => {
            sm.emit({
              event: ClientEvents.ChatMessage,
              data: { text: msg },
            });
          }}
        >
          chat
        </Button>
      </Stack>
      {/* <MainContainer
        handleCrafting={handleCrafting}
        handleDiceRoll={handleDiceRoll}
        handlePassTurn={handlePassTurn}
        players={players}
        currentPlayer={
          availableActions !== undefined
            ? {
                ...currentPlayer,
                availableActions: availableActions,
              }
            : {
                ...currentPlayer,
              }
        }
        turn={turn}
      /> */}
    </Stack>
  );
};

export default PlayPage;
