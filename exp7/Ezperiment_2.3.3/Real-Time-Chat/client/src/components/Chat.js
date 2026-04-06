import React, { useEffect, useRef } from "react";
import { Box, Typography, AppBar, Toolbar, Chip } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import ChatIcon from "@mui/icons-material/Chat";
import { useSocket } from "../context/SocketContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import OnlineUsers from "./OnlineUsers";

const Chat = () => {
  const { currentUser, messages, onlineUsers, typingUsers } = useSocket();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const typingList = Object.values(typingUsers);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0f0c29" }}>
      {/* Header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <ChatIcon sx={{ color: "#6c63ff" }} />
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1, letterSpacing: 1 }}>
            LiveChat
          </Typography>
          <Chip
            icon={<CircleIcon sx={{ fontSize: "10px !important", color: "#3ecf8e !important" }} />}
            label={`@${currentUser?.username}`}
            size="small"
            sx={{
              background: "rgba(62,207,142,0.1)",
              color: "#3ecf8e",
              border: "1px solid rgba(62,207,142,0.3)",
              fontWeight: 600,
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Body */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Messages */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              py: 2,
              "&::-webkit-scrollbar": { width: 4 },
              "&::-webkit-scrollbar-thumb": { background: "rgba(108,99,255,0.4)", borderRadius: 2 },
            }}
          >
            {messages.length === 0 && (
              <Box sx={{ textAlign: "center", mt: 8, color: "rgba(255,255,255,0.2)" }}>
                <ChatIcon sx={{ fontSize: 48, mb: 1 }} />
                <Typography>No messages yet. Say hello!</Typography>
              </Box>
            )}
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.userId === currentUser?.id}
              />
            ))}

            {/* Typing indicators */}
            {typingList.length > 0 && (
              <Box sx={{ px: 2, py: 0.5 }}>
                <Typography variant="caption" sx={{ color: "#6c63ff", fontStyle: "italic" }}>
                  {typingList.length === 1
                    ? `${typingList[0]} is typing…`
                    : `${typingList.join(", ")} are typing…`}
                </Typography>
              </Box>
            )}

            <div ref={bottomRef} />
          </Box>

          {/* Input */}
          <MessageInput />
        </Box>

        {/* Online users sidebar */}
        <OnlineUsers users={onlineUsers} currentUserId={currentUser?.id} />
      </Box>
    </Box>
  );
};

export default Chat;
