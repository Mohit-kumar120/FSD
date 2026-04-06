import React from "react";
import { Box, Typography, Avatar, Badge } from "@mui/material";

const getColor = (name) => {
  const colors = ["#6c63ff", "#3ecf8e", "#ff6b6b", "#ffd93d", "#4ecdc4", "#a29bfe"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const OnlineUsers = ({ users, currentUserId }) => {
  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        borderLeft: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        flexDirection: "column",
        background: "rgba(0,0,0,0.2)",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          px: 2, py: 1.5,
          fontWeight: 700, letterSpacing: 2,
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        Online — {users.length}
      </Typography>

      <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {users.map((user) => (
          <Box
            key={user.id}
            sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              px: 1.5, py: 1, borderRadius: 2,
              background: user.id === currentUserId ? "rgba(108,99,255,0.15)" : "transparent",
              transition: "background 0.2s",
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#3ecf8e", border: "2px solid #1a1a2e" }} />
              }
            >
              <Avatar sx={{ width: 30, height: 30, fontSize: 12, fontWeight: 700, background: getColor(user.username) }}>
                {user.username[0].toUpperCase()}
              </Avatar>
            </Badge>
            <Typography
              variant="body2"
              noWrap
              sx={{ color: user.id === currentUserId ? "#a29bfe" : "rgba(255,255,255,0.7)", fontWeight: user.id === currentUserId ? 700 : 400 }}
            >
              {user.id === currentUserId ? `${user.username} (you)` : user.username}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OnlineUsers;
