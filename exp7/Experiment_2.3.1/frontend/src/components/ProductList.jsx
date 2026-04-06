// src/components/ProductList.jsx
// Fetches products from Express API using Axios and renders them

import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import { productAPI } from '../services/api';

const CATEGORIES = ['All', 'Electronics', 'Sports', 'Kitchen', 'Home', 'Fashion', 'Books'];

function LoadingSpinner() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border text-primary"
        style={{ width: '3rem', height: '3rem' }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">Fetching products from server…</p>
    </div>
  );
}

function ErrorAlert({ message, onRetry }) {
  return (
    <div className="alert alert-danger alert-dismissible d-flex align-items-start gap-3" role="alert">
      <span style={{ fontSize: '1.5rem' }}>⚠️</span>
      <div className="flex-grow-1">
        <strong>Failed to load products</strong>
        <p className="mb-2 small">{message}</p>
        <button className="btn btn-danger btn-sm" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1"></i>Retry
        </button>
      </div>
    </div>
  );
}

function ProductList({ onAddToCart }) {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [activeCategory, setCategory] = useState('All');
  const [searchQuery, setSearch]      = useState('');

  // ─── Fetch Products via Axios ────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const category = activeCategory !== 'All' ? activeCategory : '';
      const response = await productAPI.getAll(category);
      setProducts(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ─── Client-side Search Filter ───────────────────────────────────────────────
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Search + Filter Bar */}
      <div className="row g-3 mb-4 align-items-center">
        {/* Search Input */}
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="col-md-7">
          <div className="d-flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm rounded-pill ${
                  activeCategory === cat ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      {!loading && !error && (
        <p className="text-muted small mb-3">
          Showing <strong>{filtered.length}</strong> product{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Error State */}
      {error && <ErrorAlert message={error} onRetry={fetchProducts} />}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-5">
          <span style={{ fontSize: '3rem' }}>🔍</span>
          <p className="text-muted mt-2">No products found. Try adjusting your search or filter.</p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="row">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
