import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { SocketProvider, useSocket } from "./context/SocketContext";
import Login from "./components/Login";
import Chat from "./components/Chat";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6c63ff" },
    background: { default: "#0f0c29" },
  },
  typography: {
    fontFamily: '"Sora", "Segoe UI", sans-serif',
  },
});

const AppContent = () => {
  const { currentUser } = useSocket();
  return currentUser ? <Chat /> : <Login />;
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
