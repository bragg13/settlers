import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { Player, ServerEvents, ServerPayloads } from '@settlers/shared';
import { GameContextType } from './types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
  const [lobbyState, setLobbyState] = useState<
    ServerPayloads[ServerEvents.LobbyState]
  >({
    lobbyId: '',
    hasStarted: false,
    hasEnded: false,
    players: [],
  });

  const [gameState, setGameState] = useState<
    ServerPayloads[ServerEvents.GameState]
  >({
    currentPlayer: '',
    currentRound: 0,
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
        gameState,
        setGameState,
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
