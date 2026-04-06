import React from 'react';
import {
  Card, CardMedia, CardContent, CardActions, Typography,
  Button, Box, Chip, Rating, IconButton, Tooltip
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectIsInCart } from '../../features/cart/cartSlice';

const badgeColors = {
  'Best Seller': { bg: '#fbbf24', color: '#1a1a1a' },
  'Hot': { bg: '#ef4444', color: '#fff' },
  'New': { bg: '#10b981', color: '#fff' },
  'Sale': { bg: '#8b5cf6', color: '#fff' },
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const inCart = useSelector(selectIsInCart(product.id));

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          border: '1px solid rgba(167,139,250,0.4)',
          boxShadow: '0 20px 60px rgba(139,92,246,0.2)',
          '& .product-image': {
            transform: 'scale(1.08)',
          },
          '& .add-btn': {
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          },
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 220 }}>
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          className="product-image"
          sx={{
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
        />
        {product.badge && (
          <Chip
            label={product.badge}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontWeight: 700,
              fontSize: '0.7rem',
              background: badgeColors[product.badge]?.bg || '#8b5cf6',
              color: badgeColors[product.badge]?.color || '#fff',
              border: 'none',
              borderRadius: '6px',
            }}
          />
        )}
        {inCart && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(16,185,129,0.9)',
              borderRadius: '50%',
              p: 0.3,
              display: 'flex',
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 20, color: '#fff' }} />
          </Box>
        )}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(transparent, rgba(15,12,41,0.9))',
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Chip
          label={product.category}
          size="small"
          sx={{
            mb: 1,
            background: 'rgba(167,139,250,0.12)',
            color: '#c4b5fd',
            border: '1px solid rgba(167,139,250,0.2)',
            fontSize: '0.65rem',
            height: 20,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            color: '#f1f5f9',
            fontSize: '1rem',
            mb: 0.5,
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'rgba(255,255,255,0.5)', mb: 1.5, fontSize: '0.78rem', lineHeight: 1.5 }}
        >
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Rating value={product.rating} precision={0.1} size="small" readOnly
            sx={{ '& .MuiRating-iconFilled': { color: '#fbbf24' } }}
          />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            ({product.reviews.toLocaleString()})
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2.5, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #a78bfa, #f9a8d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.2rem',
          }}
        >
          ${product.price.toFixed(2)}
        </Typography>

        <Button
          variant="contained"
          size="small"
          className="add-btn"
          startIcon={inCart ? <CheckCircleIcon /> : <AddShoppingCartIcon />}
          onClick={handleAddToCart}
          sx={{
            background: inCart
              ? 'linear-gradient(135deg, #059669, #10b981)'
              : 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            px: 2,
            fontSize: '0.8rem',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 8px 25px rgba(139,92,246,0.4)',
            },
          }}
        >
          {inCart ? 'Add More' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
