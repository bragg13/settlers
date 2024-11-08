import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSocketManager } from '../../hooks/useSocketManager';
import { ClientEvents, ServerEvents, ServerPayloads } from '@settlers/shared';

const Chat = () => {
  const [msg, setMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const sm = useSocketManager();

  useEffect(() => {
    const onChatMessage = (data: ServerPayloads[ServerEvents.ChatMessage]) => {
      console.log(`[chat] ${data.username} says: ${data.text}`);
      setChatHistory((prevChatHistory) => [...prevChatHistory, data]);
    };
    sm.registerListener(ServerEvents.ChatMessage, onChatMessage);

    return () => {
      sm.removeListener(ServerEvents.ChatMessage, onChatMessage);
    };
  });

  return (
    <Stack
      sx={{
        minHeight: 300,
        maxWidth: 150,
        minWidth: 100,
      }}
    >
      <Paper>
        {chatHistory.current.map(
          (msg: ServerPayloads[ServerEvents.ChatMessage], i: number) => {
            return (
              <Paper key={i}>
                <Typography>{msg.username}</Typography>
                <Typography>{msg.text}</Typography>
              </Paper>
            );
          }
        )}
      </Paper>
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
  );
};
export default Chat;
