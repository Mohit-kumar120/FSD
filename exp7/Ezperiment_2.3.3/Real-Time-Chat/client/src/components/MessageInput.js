import React, { useState, useRef } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSocket } from "../context/SocketContext";

const MessageInput = () => {
  const [text, setText] = useState("");
  const { sendMessage, startTyping, stopTyping } = useSocket();
  const typingTimer = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    startTyping();
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => stopTyping(), 1500);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
    stopTyping();
    clearTimeout(typingTimer.current);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        px: 2, py: 1.5,
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", gap: 1,
        background: "rgba(0,0,0,0.2)",
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Type a message… (Enter to send)"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKey}
        variant="outlined"
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            background: "rgba(255,255,255,0.05)",
            borderRadius: 3,
            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
            "&:hover fieldset": { borderColor: "#6c63ff" },
            "&.Mui-focused fieldset": { borderColor: "#6c63ff" },
          },
          "& textarea::placeholder": { color: "rgba(255,255,255,0.3)" },
        }}
      />
      <IconButton
        onClick={handleSend}
        disabled={!text.trim()}
        sx={{
          background: "linear-gradient(135deg, #6c63ff, #3ecf8e)",
          color: "#fff",
          width: 44, height: 44,
          "&:hover": { opacity: 0.85 },
          "&.Mui-disabled": { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" },
        }}
      >
        <SendIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
