import React from 'react';
import {
  Box, Typography, IconButton, Button, Divider,
  List, ListItem, Avatar, Chip, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCartItems, selectCartTotal, selectCartCount,
  removeFromCart, updateQuantity, clearCart
} from '../../features/cart/cartSlice';

const CartDrawer = ({ onClose }) => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);

  const discount = total > 200 ? total * 0.1 : 0;
  const finalTotal = total - discount;
  const shipping = finalTotal > 100 ? 0 : 9.99;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShoppingBagIcon sx={{ color: '#a78bfa' }} />
          <Typography variant="h6" sx={{
            fontFamily: '"Playfair Display", serif',
            color: '#f1f5f9',
            fontWeight: 700,
          }}>
            Your Cart
          </Typography>
          <Chip
            label={count}
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff',
              fontWeight: 700,
              minWidth: 28,
            }}
          />
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#f43f5e' } }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Items */}
      {items.length === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, p: 4 }}>
          <ShoppingBagIcon sx={{ fontSize: 80, color: 'rgba(167,139,250,0.2)' }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
            Your cart is empty.<br />Start shopping to add items!
          </Typography>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: 'rgba(167,139,250,0.5)',
              color: '#c4b5fd',
              '&:hover': { borderColor: '#a78bfa', background: 'rgba(167,139,250,0.1)' },
              borderRadius: '10px',
              textTransform: 'none',
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <>
          <List sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(167,139,250,0.3)', borderRadius: 2 },
          }}>
            {items.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  py: 2,
                  px: 1.5,
                  mb: 1.5,
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0,
                }}
              >
                <Box sx={{ display: 'flex', width: '100%', gap: 1.5, alignItems: 'flex-start' }}>
                  <Avatar
                    src={item.image}
                    variant="rounded"
                    sx={{ width: 60, height: 60, borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#a78bfa', fontWeight: 700 }}>
                      ${item.price.toFixed(2)} each
                    </Typography>
                  </Box>
                  <Tooltip title="Remove item">
                    <IconButton
                      size="small"
                      onClick={() => dispatch(removeFromCart(item.id))}
                      sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#f43f5e', background: 'rgba(244,63,94,0.1)' } }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mt: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      sx={{ color: '#c4b5fd', p: 0.5 }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ color: '#f1f5f9', fontWeight: 700, px: 1.5, minWidth: 24, textAlign: 'center', fontSize: '0.9rem' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      sx={{ color: '#c4b5fd', p: 0.5 }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography sx={{ color: '#f9a8d4', fontWeight: 700, fontSize: '0.95rem' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>

          {/* Summary */}
          <Box sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
            {discount > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, p: 1.5, background: 'rgba(16,185,129,0.1)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <LocalOfferIcon sx={{ fontSize: 16, color: '#10b981' }} />
                <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                  10% discount applied on orders over $200!
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Subtotal</Typography>
              <Typography variant="body2" sx={{ color: '#f1f5f9' }}>${total.toFixed(2)}</Typography>
            </Box>
            {discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography variant="body2" sx={{ color: '#10b981' }}>Discount (10%)</Typography>
                <Typography variant="body2" sx={{ color: '#10b981' }}>-${discount.toFixed(2)}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Shipping</Typography>
              <Typography variant="body2" sx={{ color: shipping === 0 ? '#10b981' : '#f1f5f9' }}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
              <Typography variant="h6" sx={{ color: '#f1f5f9', fontWeight: 700 }}>Total</Typography>
              <Typography variant="h6" sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #a78bfa, #f9a8d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ${(finalTotal + shipping).toFixed(2)}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                borderRadius: '12px',
                py: 1.5,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
                mb: 1.5,
                '&:hover': { background: 'linear-gradient(135deg, #6d28d9, #9333ea)', transform: 'scale(1.02)' },
                transition: 'all 0.2s ease',
              }}
            >
              Checkout • ${(finalTotal + shipping).toFixed(2)}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => dispatch(clearCart())}
              sx={{
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'none',
                fontSize: '0.8rem',
                '&:hover': { color: '#f43f5e', background: 'rgba(244,63,94,0.05)' },
              }}
            >
              Clear Cart
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default CartDrawer;
