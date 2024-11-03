import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Notifications } from '@mantine/notifications';
import { MantineProvider } from '@mantine/core';
import App from './App';
import { SocketManagerProvider } from './components/websocket/SocketManagerProvider';
import { GameContextProvider } from './components/game/GameContext';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <SocketManagerProvider>
      <GameContextProvider>
        <MantineProvider>
          <Notifications />
          <App />
        </MantineProvider>
      </GameContextProvider>
    </SocketManagerProvider>
  </StrictMode>
);
