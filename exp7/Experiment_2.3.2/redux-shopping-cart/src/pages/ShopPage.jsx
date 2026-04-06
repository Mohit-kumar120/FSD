import React, { useState, useMemo } from 'react';
import {
  Container, Grid, Typography, Box, Chip, TextField,
  InputAdornment, Select, MenuItem, FormControl, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ProductCard from '../components/ProductCard/ProductCard';
import { products, categories } from '../utils/products';
import { useSelector } from 'react-redux';
import { selectCartCount, selectCartTotal } from '../features/cart/cartSlice';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'reviews') result = [...result].sort((a, b) => b.reviews - a.reviews);

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f0c29 0%, #1a1740 50%, #0f0c29 100%)' }}>
      {/* Hero */}
      <Box
        sx={{
          py: { xs: 5, md: 8 },
          px: 2,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)',
          },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 900,
            fontSize: { xs: '2.2rem', md: '3.5rem' },
            background: 'linear-gradient(135deg, #c4b5fd 0%, #f9a8d4 50%, #c4b5fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Premium Collection
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 4, fontSize: '1.05rem' }}>
          Curated products with Redux-powered state management
        </Typography>

        {/* Stats Bar */}
        {cartCount > 0 && (
          <Box
            sx={{
              display: 'inline-flex',
              gap: 3,
              px: 4,
              py: 1.5,
              background: 'rgba(167,139,250,0.1)',
              border: '1px solid rgba(167,139,250,0.2)',
              borderRadius: '50px',
              mb: 3,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#c4b5fd', fontWeight: 800, lineHeight: 1 }}>{cartCount}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>Items</Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#f9a8d4', fontWeight: 800, lineHeight: 1 }}>${cartTotal.toFixed(0)}</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>In Cart</Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Container maxWidth="xl" sx={{ pb: 8 }}>
        {/* Filters */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 4,
          p: 2.5,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '18px',
          alignItems: 'center',
        }}>
          <TextField
            placeholder="Search products..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 220,
              '& .MuiOutlinedInput-root': {
                color: '#f1f5f9',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(167,139,250,0.4)' },
                '&.Mui-focused fieldset': { borderColor: '#8b5cf6' },
              },
              '& input::placeholder': { color: 'rgba(255,255,255,0.3)' },
            }}
          />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flex: 1 }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => setSelectedCategory(cat)}
                sx={{
                  background: selectedCategory === cat
                    ? 'linear-gradient(135deg, #7c3aed, #a855f7)'
                    : 'rgba(255,255,255,0.06)',
                  color: selectedCategory === cat ? '#fff' : 'rgba(255,255,255,0.6)',
                  border: selectedCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  fontWeight: selectedCategory === cat ? 700 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: selectedCategory === cat
                      ? 'linear-gradient(135deg, #6d28d9, #9333ea)'
                      : 'rgba(255,255,255,0.1)',
                  },
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TuneIcon sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }} />
            <FormControl size="small">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  minWidth: 140,
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { background: '#1a1740', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
                  },
                }}
              >
                <MenuItem value="default" sx={{ color: '#f1f5f9' }}>Featured</MenuItem>
                <MenuItem value="price-asc" sx={{ color: '#f1f5f9' }}>Price: Low to High</MenuItem>
                <MenuItem value="price-desc" sx={{ color: '#f1f5f9' }}>Price: High to Low</MenuItem>
                <MenuItem value="rating" sx={{ color: '#f1f5f9' }}>Top Rated</MenuItem>
                <MenuItem value="reviews" sx={{ color: '#f1f5f9' }}>Most Reviewed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Results count */}
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.35)', mb: 3, ml: 0.5 }}>
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
        </Typography>

        {/* Product Grid */}
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>

        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.2)', fontFamily: '"Playfair Display", serif' }}>
              No products found
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ShopPage;
