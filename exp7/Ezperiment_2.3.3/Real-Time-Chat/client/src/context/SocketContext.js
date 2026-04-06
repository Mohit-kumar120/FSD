import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // { userId: username }

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", { autoConnect: false });
    const socket = socketRef.current;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("user:joined", (user) => setCurrentUser(user));

    socket.on("users:update", (users) => setOnlineUsers(users));

    socket.on("message:receive", (msg) =>
      setMessages((prev) => [...prev, { ...msg, type: "chat" }])
    );

    socket.on("message:system", (msg) =>
      setMessages((prev) => [...prev, { ...msg, type: "system", id: `sys-${Date.now()}` }])
    );

    socket.on("typing:update", ({ userId, username, isTyping }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        if (isTyping) next[userId] = username;
        else delete next[userId];
        return next;
      });
    });

    return () => socket.disconnect();
  }, []);

  const join = (username) => {
    socketRef.current.connect();
    socketRef.current.emit("user:join", username);
  };

  const sendMessage = (text) => {
    if (text.trim()) socketRef.current.emit("message:send", text);
  };

  const startTyping = () => socketRef.current.emit("typing:start");
  const stopTyping = () => socketRef.current.emit("typing:stop");

  return (
    <SocketContext.Provider
      value={{
        connected,
        currentUser,
        messages,
        onlineUsers,
        typingUsers,
        join,
        sendMessage,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
