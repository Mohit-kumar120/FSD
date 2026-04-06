# Experiment 2.3.3 — Real-Time Chat with WebSocket Connections (Socket.IO)

## Aim
To develop a real-time chat application using WebSocket connections with Socket.IO for bidirectional communication.

---

## Objectives
1. Implement Socket.IO server with Express
2. Create responsive chat UI with React
3. Handle real-time messaging and broadcasting
4. Manage user connections and disconnections
5. Implement typing indicators
6. Display online users

---

## Hardware / Software Requirements
| Requirement | Version |
|---|---|
| Node.js | v18+ |
| Socket.IO | v4.7+ |
| React | v18+ |
| Express | v4.18+ |
| Material UI | v5.14+ |
| VS Code | Latest |

---

## Project Structure
```
exp2-3-3/                          ← Root folder
├── package.json                   ← Root scripts (concurrently)
├── README.md
│
├── server/                        ← Express + Socket.IO backend
│   ├── package.json
│   └── index.js                   ← Server entry point
│
└── client/                        ← React frontend
    ├── package.json
    ├── public/
    │   └── index.html             ← HTML entry (CRA)
    └── src/
        ├── index.js               ← React DOM root
        ├── App.js                 ← Theme + Route guard
        ├── context/
        │   └── SocketContext.js   ← Socket.IO client + React context
        └── components/
            ├── Login.js           ← Username entry screen
            ├── Chat.js            ← Main chat layout
            ├── MessageBubble.js   ← Single message / system notification
            ├── MessageInput.js    ← Textarea + send + typing events
            └── OnlineUsers.js     ← Right-hand sidebar
```

---

## Setup & Run

### Step 1 — Install dependencies
```bash
# From the root folder
npm install                   # installs concurrently
npm run install:all           # installs server + client deps
```

### Step 2 — Run both servers (dev mode)
```bash
npm run dev
```
- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:3000

> Open multiple browser tabs/windows to simulate multiple users.

---

## How It Works

### WebSocket Handshake
```
Client                         Server
  |──── HTTP Upgrade Request ────▶|
  |◀─── 101 Switching Protocols ──|
  |══════ WebSocket Frames ═══════|  ← persistent, full-duplex
```

### Socket Events Reference
| Event | Direction | Description |
|---|---|---|
| `user:join` | client → server | Register username |
| `user:joined` | server → client | Confirm registration |
| `users:update` | server → all | Updated online list |
| `message:send` | client → server | Send chat message |
| `message:receive` | server → all | Broadcast message |
| `message:system` | server → all | Join/leave notification |
| `typing:start` | client → server | User started typing |
| `typing:stop` | client → server | User stopped typing |
| `typing:update` | server → others | Relay typing state |

---

## Expected Output

### 1. Login Screen
- Clean username input field
- "Enter Chat" button (enabled when ≥ 2 characters)

### 2. Chat Interface
- Header: app name + current username badge
- Message area:
  - Avatar with initial letter
  - Username + timestamp
  - Rounded message bubbles (gradient for own, glass for others)
  - System notifications (join/leave)
- Right sidebar: live online users with green dot badge
- Bottom: message input + send button

### 3. Real-Time Updates
- Messages appear instantly across all connected clients
- Online user list refreshes on every join/leave
- Typing indicators appear and auto-clear after 1.5 s of inactivity

---

## Key Concepts

**WebSocket** — A persistent, full-duplex TCP connection allowing both client and server to push data at any time without polling.

**Socket.IO** — A library that wraps WebSocket with fallbacks (long-polling), automatic reconnection, and a convenient event-based API.

**Broadcasting** — `io.emit()` sends to ALL clients; `socket.broadcast.emit()` sends to all EXCEPT the sender.

**Typing Debounce** — A `setTimeout` clears the typing indicator 1.5 s after the last keystroke, avoiding excessive server events.

---

## Result
A fully functional real-time group chat application demonstrating Socket.IO's bidirectional event model, React context-based state management, and Material UI for a polished dark-themed interface.
