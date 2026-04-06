import React, { useState } from "react";
import {
  Box, Button, TextField, Typography, Paper, InputAdornment,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import { useSocket } from "../context/SocketContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const { join } = useSocket();

  const handleJoin = () => {
    const trimmed = username.trim();
    if (trimmed.length < 2) return;
    join(trimmed);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleJoin();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: 5,
          width: 380,
          borderRadius: 4,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff",
        }}
      >
        {/* Icon */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              p: 2,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6c63ff, #3ecf8e)",
              mb: 2,
            }}
          >
            <ChatIcon sx={{ fontSize: 40, color: "#fff" }} />
          </Box>
          <Typography variant="h4" fontWeight={700} letterSpacing={1}>
            LiveChat
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mt: 0.5 }}>
            Real-time messaging powered by Socket.IO
          </Typography>
        </Box>

        {/* Input */}
        <TextField
          fullWidth
          label="Choose a username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ color: "#6c63ff" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": { borderColor: "#6c63ff" },
              "&.Mui-focused fieldset": { borderColor: "#6c63ff" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#6c63ff" },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={username.trim().length < 2}
          onClick={handleJoin}
          sx={{
            py: 1.5,
            borderRadius: 3,
            background: "linear-gradient(135deg, #6c63ff, #3ecf8e)",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: 1,
            textTransform: "none",
            "&:hover": { opacity: 0.9 },
            "&.Mui-disabled": { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" },
          }}
        >
          Enter Chat
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
