import { Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSocketManager } from '../../hooks/useSocketManager';
import { ClientEvents, ServerEvents, ServerPayloads } from '@settlers/shared';

const Chat = () => {
  const [msg, setMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<
    Array<ServerPayloads[ServerEvents.ChatMessage]>
  >([]);
  const sm = useSocketManager();

  useEffect(() => {
    const onChatMessage = (data: ServerPayloads[ServerEvents.ChatMessage]) => {
      console.log(`[chat] ${data.username} says: ${data.text}`);
      const newArr = [...chatHistory, data];
      setChatHistory(newArr);
    };
    sm.registerListener(ServerEvents.ChatMessage, onChatMessage);

    return () => {
      sm.removeListener(ServerEvents.ChatMessage, onChatMessage);
    };
  });

  const handleSendMessage = () => {
    if (msg.trim()) {
      sm.emit({
        event: ClientEvents.ChatMessage,
        data: { text: msg },
      });
      setMsg('');
    }
  };

  return (
    <Stack
      sx={{
        width: 300,
        height: 200,
        border: '1px solid #ccc',
        borderRadius: 2,
        padding: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          overflowY: 'auto',
          padding: 1,
          borderColor: 'white',
          marginBottom: 1,
        }}
      >
        {chatHistory.map((msg, i) => (
          <Typography key={i} variant="body2" sx={{ marginBottom: 0.5 }}>
            <strong>{msg.username}</strong>: {msg.text}
          </Typography>
        ))}
      </Paper>
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Type a message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Stack>
    </Stack>
  );
};
export default Chat;
