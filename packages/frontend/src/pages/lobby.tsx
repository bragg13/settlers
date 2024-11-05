import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useSocketManager } from '../hooks/useSocketManager';
import {
  ClientEvents,
  ClientPayloads,
  ServerEvents,
  ServerPayloads,
} from '@settlers/shared';
import { Avatar, CircularProgress, Divider, Radio, Stack } from '@mui/material';
import {
  useLobbyState,
  usePlayerInformation,
} from '../components/game/GameContext';

type PageState = 'login' | 'lobby';

const LobbyPage = () => {
  // debug only - automactically join lobby
  // const autoLogin = false;
  // useEffect(() => {
  //   if (autoLogin) {
  //     setFormLobby((prev) => ({
  //       ...prev,
  //       color: 'green',
  //       username: 'andrea',
  //       lobbyId: '1234',
  //     }));
  //     sm.emit({
  //       event: ClientEvents.LobbyJoin,
  //       data: {
  //         ...formLobby,
  //       },
  //     });

  //     // save username and color info to socket state
  //     sm.socketStateDispatch({
  //       type: 'CONNECT',
  //       payload: {
  //         username: formLobby.username,
  //         color: formLobby.color,
  //       },
  //     });
  //   }
  // }, []);

  // lobby state and player list
  const [formLobby, setFormLobby] = useState<
    ClientPayloads[ClientEvents.LobbyJoin]
  >({
    username: '',
    color: '',
    lobbyId: '',
  });
  const { playerInformation, setPlayerInformation } = usePlayerInformation();
  const [pageState, setPageState] = useState<PageState>('login');
  const [players, setPlayers] = useState<{ username: string; color: string }[]>(
    []
  );
  const {
    lobbyState,
  }: { lobbyState: ServerPayloads[ServerEvents.LobbyState] } = useLobbyState();

  // update players list when new player joins
  useEffect(() => {
    if (lobbyState.players.length !== players.length) {
      setPlayers(lobbyState.players);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobbyState.players.length]);

  const controlProps = (item: string) => ({
    checked: formLobby.color === item,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setFormLobby((prev) => ({
        ...prev,
        color: e.target.value,
      }));
    },
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  const sm = useSocketManager();

  function onJoinClick(): void {
    sm.emit({
      event: ClientEvents.LobbyJoin,
      data: {
        ...formLobby,
      },
    });

    // save username and color info to socket state
    sm.socketStateDispatch({
      type: 'CONNECT',
      payload: {
        username: formLobby.username,
        color: formLobby.color,
      },
    });
    setPlayerInformation({
      username: formLobby.username,
      color: formLobby.color,
      socketId: sm.getSocketId(),
    });
    setPageState('lobby');
  }

  const renderLogin = () => {
    return (
      <>
        <Typography component="h1" variant="h5">
          Join or create a lobby!
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={formLobby.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault();
              setFormLobby((prev) => ({
                ...prev,
                username: e.target.value,
              }));
            }}
            autoFocus
          />
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            name="lobbyId"
            label="Lobby ID"
            type="lobbyId"
            id="lobbyId"
            value={formLobby.lobbyId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.preventDefault();
              setFormLobby((prev) => ({
                ...prev,
                lobbyId: e.target.value,
              }));
            }}
          />
          <Box>
            Color:
            <Radio
              {...controlProps('green')}
              sx={{
                color: 'green',
                '&.Mui-checked': {
                  color: 'green',
                },
              }}
            />
            <Radio
              {...controlProps('blue')}
              sx={{
                color: 'blue',
                '&.Mui-checked': {
                  color: 'blue',
                },
              }}
            />
            <Radio
              {...controlProps('red')}
              sx={{
                color: 'red',
                '&.Mui-checked': {
                  color: 'red',
                },
              }}
            />
            <Radio
              {...controlProps('black')}
              sx={{
                color: 'black',
                '&.Mui-checked': {
                  color: 'black',
                },
              }}
            />
          </Box>
          <Stack direction="row" gap={2}>
            <Button
              onClick={onJoinClick}
              fullWidth
              id="join"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="warning"
            >
              Join lobby
            </Button>
          </Stack>
        </Box>
      </>
    );
  };

  const renderLobby = () => {
    return (
      <>
        <Typography component="h1" variant="h4">
          Lobby <strong>{formLobby.lobbyId}</strong>
        </Typography>
        <Divider />
        <Box>
          {players.map((player) => (
            <Stack
              key={player.username}
              direction="row"
              gap={2}
              sx={{ alignItems: 'center', margin: '10px' }}
            >
              <Avatar sx={{ bgcolor: player.color }}>
                {player.username[0].toUpperCase()}
              </Avatar>
              <Typography>{player.username}</Typography>
            </Stack>
          ))}
          <Divider />
          <Typography>Waiting for players to join...</Typography>
          <CircularProgress />
        </Box>
      </>
    );
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {pageState === 'lobby' ? renderLobby() : renderLogin()}
      </Box>
    </Container>
  );
};

export default LobbyPage;
