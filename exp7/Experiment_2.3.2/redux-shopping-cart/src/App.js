import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import store from './app/store';
import Header from './components/Header/Header';
import ShopPage from './pages/ShopPage';
import Notification from './components/Notification/Notification';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#8b5cf6' },
    secondary: { main: '#f9a8d4' },
    background: { default: '#0f0c29', paper: '#1a1740' },
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <ShopPage />
        <Notification />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
