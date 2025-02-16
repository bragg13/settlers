import { useEffect } from 'react';
import { useSocketManager } from '../hooks/useSocketManager';
import { ServerEvents, ServerPayloads } from '@settlers/shared';
import PlayPage from '../pages/play';
import LobbyPage from '../pages/lobby';
import { showNotification } from '@mantine/notifications';
import {
  useAvailableActions,
  useLobbyState,
  usePlayerInformation,
} from './game/GameContext';

const GameManager = () => {
  const sm = useSocketManager();
  const { lobbyState, setLobbyState } = useLobbyState();
  const { setAvailableActions } = useAvailableActions();
  const { setPlayerInformation } = usePlayerInformation();

  useEffect(() => {
    sm.connect();

    const onGameMessage = (data: ServerPayloads[ServerEvents.GameMessage]) => {
      showNotification({
        message: data.message,
        color: data.color,
      });
    };

    const onPlayerInformation = (
      data: ServerPayloads[ServerEvents.PlayerInformation]
    ) => {
      setPlayerInformation(data);
    };
    const onLobbyState = (data: ServerPayloads[ServerEvents.LobbyState]) => {
      setLobbyState(data);
    };

    const onAvailableActions = (
      data: ServerPayloads[ServerEvents.AvailableActions]
    ) => {
      setAvailableActions(data);
    };

    sm.registerListener(ServerEvents.GameMessage, onGameMessage);
    sm.registerListener(ServerEvents.LobbyState, onLobbyState);
    sm.registerListener(ServerEvents.AvailableActions, onAvailableActions);
    sm.registerListener(ServerEvents.PlayerInformation, onPlayerInformation);

    // remove listeners when dismounting
    return () => {
      sm.removeListener(ServerEvents.GameMessage, onGameMessage);
      sm.removeListener(ServerEvents.LobbyState, onLobbyState);
      sm.removeListener(ServerEvents.AvailableActions, onAvailableActions);
      sm.removeListener(ServerEvents.PlayerInformation, onPlayerInformation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return lobbyState.hasStarted ? <PlayPage /> : <LobbyPage />;
};

export default GameManager;
