import { createContext, useContext, useState, ReactNode } from 'react';
import { ServerEvents, ServerPayloads } from '@settlers/shared';
import { GameContextType } from './types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [lobbyState, setLobbyState] = useState<
    ServerPayloads[ServerEvents.LobbyState]
  >({
    lobbyId: '',
    hasStarted: false,
    hasEnded: false,
    currentRound: 0,
    currentPlayerIndex: 0,
    players: [],
  });

  const [gameState, setGameState] = useState<
    ServerPayloads[ServerEvents.GameState]
  >({
    map: '',
  });

  return (
    <GameContext.Provider
      value={{ lobbyState, setLobbyState, gameState, setGameState }}
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

export const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return {
    gameState: context.gameState,
    setGameState: context.setGameState,
  };
};
