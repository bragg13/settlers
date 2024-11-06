import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { Player, ServerEvents, ServerPayloads } from '@settlers/shared';
import { GameContextType } from './types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [lobbyState, setLobbyState] = useState<
    ServerPayloads[ServerEvents.LobbyState]
  >({
    lobbyId: '',
    currentPlayer: '',
    currentRound: 0,
    hasStarted: false,
    hasEnded: false,
    players: [],
  });

  const [availableActions, setAvailableActions] = useState<
    ServerPayloads[ServerEvents.AvailableActions]
  >({
    availableActions: [],
    buildableCities: null,
    buildableRoads: null,
    buildableSpots: null,
  });

  const [playerInformation, setPlayerInformation] = useState<Player>({
    color: '',
    socketId: '',
    username: '',
  });

  return (
    <GameContext.Provider
      value={{
        lobbyState,
        setLobbyState,
        availableActions,
        setAvailableActions,
        setPlayerInformation,
        playerInformation,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useLobbyState = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return {
    lobbyState: context.lobbyState,
    setLobbyState: context.setLobbyState,
  };
};

export const useAvailableActions = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return {
    availableActions: context.availableActions,
    setAvailableActions: context.setAvailableActions,
  };
};

export const usePlayerInformation = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return {
    setPlayerInformation: context.setPlayerInformation,
    playerInformation: context.playerInformation,
  };
};
