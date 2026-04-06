import React from "react";
import { Box, Avatar, Typography } from "@mui/material";

const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const getColor = (name) => {
  const colors = ["#6c63ff", "#3ecf8e", "#ff6b6b", "#ffd93d", "#4ecdc4", "#a29bfe"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const MessageBubble = ({ message, isOwn }) => {
  if (message.type === "system") {
    return (
      <Box sx={{ textAlign: "center", my: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 2, py: 0.5, borderRadius: 10,
            background: "rgba(108,99,255,0.15)",
            color: "rgba(255,255,255,0.5)",
            fontSize: 11,
          }}
        >
          {message.text} · {formatTime(message.timestamp)}
        </Typography>
      </Box>
    );
  }

  const avatarColor = getColor(message.username);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isOwn ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 1,
        mb: 1.5,
        px: 1,
      }}
    >
      <Avatar
        sx={{
          width: 34, height: 34, fontSize: 13, fontWeight: 700,
          background: avatarColor, flexShrink: 0,
        }}
      >
        {message.username[0].toUpperCase()}
      </Avatar>

      <Box sx={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start" }}>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)", mb: 0.3, px: 1 }}>
          {isOwn ? "You" : message.username} · {formatTime(message.timestamp)}
        </Typography>
        <Box
          sx={{
            px: 2, py: 1.2, borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isOwn
              ? "linear-gradient(135deg, #6c63ff, #3ecf8e)"
              : "rgba(255,255,255,0.08)",
            border: isOwn ? "none" : "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.5, wordBreak: "break-word" }}>
            {message.text}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MessageBubble;
