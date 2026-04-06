import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Drawer,
  Box, Tooltip, Chip
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../../features/cart/cartSlice';
import CartDrawer from '../Cart/CartDrawer';

const Header = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = useSelector(selectCartCount);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Toolbar sx={{ py: 1, px: { xs: 2, md: 4 } }}>
          <StorefrontIcon sx={{ mr: 1.5, color: '#a78bfa', fontSize: 28 }} />
          <Typography
            variant="h5"
            sx={{
              flexGrow: 1,
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              letterSpacing: '0.05em',
              background: 'linear-gradient(90deg, #c4b5fd, #f9a8d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            LUXE STORE
          </Typography>

          <Chip
            label="Redux Powered"
            size="small"
            sx={{
              mr: 2,
              background: 'rgba(167,139,250,0.15)',
              border: '1px solid rgba(167,139,250,0.3)',
              color: '#c4b5fd',
              fontSize: '0.65rem',
              display: { xs: 'none', sm: 'flex' },
            }}
          />

          <Tooltip title="View Cart">
            <IconButton
              onClick={() => setCartOpen(true)}
              sx={{
                color: 'white',
                background: 'rgba(167,139,250,0.15)',
                border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: '12px',
                px: 1.5,
                '&:hover': {
                  background: 'rgba(167,139,250,0.3)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <Badge
                badgeContent={cartCount}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                    fontWeight: 700,
                  },
                }}
              >
                <ShoppingCartIcon />
              </Badge>
              {cartCount > 0 && (
                <Typography
                  variant="caption"
                  sx={{ ml: 1, color: '#c4b5fd', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
                >
                  Cart
                </Typography>
              )}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100vw', sm: 420 },
            background: 'linear-gradient(160deg, #0f0c29 0%, #1a1740 100%)',
            borderLeft: '1px solid rgba(167,139,250,0.2)',
          },
        }}
      >
        <CartDrawer onClose={() => setCartOpen(false)} />
      </Drawer>
    </>
  );
};

export default Header;
