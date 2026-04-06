const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// In-memory store for connected users
const onlineUsers = new Map(); // socketId -> { username, id }

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "Chat server running",
    onlineUsers: onlineUsers.size,
  });
});

io.on("connection", (socket) => {
  console.log(`[Socket] New connection: ${socket.id}`);

  // ── User Registration ──────────────────────────────────────────────
  socket.on("user:join", (username) => {
    const user = { id: socket.id, username };
    onlineUsers.set(socket.id, user);

    console.log(`[Join] ${username} joined. Total: ${onlineUsers.size}`);

    // Confirm to the joining user
    socket.emit("user:joined", user);

    // Broadcast updated user list to everyone
    io.emit("users:update", Array.from(onlineUsers.values()));

    // Notify others
    socket.broadcast.emit("message:system", {
      text: `${username} joined the chat`,
      timestamp: Date.now(),
    });
  });

  // ── Incoming Chat Message ──────────────────────────────────────────
  socket.on("message:send", (text) => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;

    const message = {
      id: `${socket.id}-${Date.now()}`,
      userId: socket.id,
      username: user.username,
      text,
      timestamp: Date.now(),
    };

    // Broadcast to ALL (including sender so they see it in order)
    io.emit("message:receive", message);
    console.log(`[Message] ${user.username}: ${text}`);
  });

  // ── Typing Indicators ──────────────────────────────────────────────
  socket.on("typing:start", () => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;
    socket.broadcast.emit("typing:update", {
      userId: socket.id,
      username: user.username,
      isTyping: true,
    });
  });

  socket.on("typing:stop", () => {
    const user = onlineUsers.get(socket.id);
    if (!user) return;
    socket.broadcast.emit("typing:update", {
      userId: socket.id,
      username: user.username,
      isTyping: false,
    });
  });

  // ── Disconnection ──────────────────────────────────────────────────
  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      console.log(`[Leave] ${user.username} disconnected.`);
      onlineUsers.delete(socket.id);

      io.emit("users:update", Array.from(onlineUsers.values()));
      io.emit("message:system", {
        text: `${user.username} left the chat`,
        timestamp: Date.now(),
      });

      // Clean up typing indicator
      io.emit("typing:update", {
        userId: socket.id,
        username: user.username,
        isTyping: false,
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Chat server listening on http://localhost:${PORT}\n`);
});
