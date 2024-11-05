import { useEffect, useRef, useState } from 'react';
import { useSocketManager } from '../hooks/useSocketManager';
import { ServerEvents, ServerPayloads } from '@settlers/shared';
import PlayPage from '../pages/play';
import LobbyPage from '../pages/lobby';
import { showNotification } from '@mantine/notifications';
import {
  useGameState,
  useLobbyState,
  usePlayerInformation,
} from './game/GameContext';

const GameManager = () => {
  const sm = useSocketManager();
  const { lobbyState, setLobbyState } = useLobbyState();
  const { gameState, setGameState } = useGameState();
  const { playerInformation } = usePlayerInformation();

  useEffect(() => {
    sm.connect();

    const onGameMessage = (data: ServerPayloads[ServerEvents.GameMessage]) => {
      console.log('game message', data);
      showNotification({
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

    const onAvailableActions = (
      data: ServerPayloads[ServerEvents.AvailableActions]
    ) => {
      console.log('available actions', data);
      setGameState((prevState) => ({
        ...prevState,
        availableActions: { ...data },
      }));
    };

    const onChatMessage = (data: ServerPayloads[ServerEvents.ChatMessage]) => {
      console.log(`[chat] ${data.username} says: ${data.text}`);
    };

    sm.registerListener(ServerEvents.GameMessage, onGameMessage);
    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    sm.registerListener(ServerEvents.GameState, onGameState);
    sm.registerListener(ServerEvents.AvailableActions, onAvailableActions);
    sm.registerListener(ServerEvents.ChatMessage, onChatMessage);

    // remove listeners when dismounting
    return () => {
      sm.removeListener(ServerEvents.GameMessage, onGameMessage);
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.GameState, onGameState);
      sm.removeListener(ServerEvents.AvailableActions, onAvailableActions);
      sm.removeListener(ServerEvents.ChatMessage, onChatMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return lobbyState.hasStarted ? <PlayPage /> : <LobbyPage />;
};

export default GameManager;
