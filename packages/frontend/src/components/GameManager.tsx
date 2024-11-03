import { useEffect, useState } from 'react';
import { useSocketManager } from '../hooks/useSocketManager';
import { ServerEvents, ServerPayloads } from '@settlers/shared';
import PlayPage from '../pages/play';
import LobbyPage from '../pages/lobby';
import { showNotification } from '@mantine/notifications';
import { useGameState, useLobbyState } from './game/GameContext';

const GameManager = () => {
  const sm = useSocketManager();
  const { lobbyState, setLobbyState } = useLobbyState();
  const { gameState, setGameState } = useGameState();

  useEffect(() => {
    sm.connect();

    const onGameMessage = (data: ServerPayloads[ServerEvents.GameMessage]) => {
      console.log('game message', data);
      showNotification({
        title: 'ciao',
        message: data.message,
        color: data.color,
      });
    };

    const onLobbyState = (data: ServerPayloads[ServerEvents.LobbyState]) => {
      console.log('lobby state', data);
      setLobbyState(data);
    };

    const onGameState = (data: ServerPayloads[ServerEvents.GameState]) => {
      console.log('game state', data);
      setGameState(data);
    };

    sm.registerListener(ServerEvents.GameMessage, onGameMessage);
    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    sm.registerListener(ServerEvents.GameState, onGameState);

    // remove listeners when dismounting
    return () => {
      sm.removeListener(ServerEvents.GameMessage, onGameMessage);
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.GameState, onGameState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return lobbyState.hasStarted ? <PlayPage /> : <LobbyPage />;
};

export default GameManager;
