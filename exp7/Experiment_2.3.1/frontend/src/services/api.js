// src/services/api.js
// Centralized Axios configuration and API calls

import axios from 'axios';

// ─── Axios Instance ───────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
API.interceptors.request.use(
  (config) => {
    // Attach auth token if present (for future auth integration)
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── Product API Functions ────────────────────────────────────────────────────
export const productAPI = {
  // Fetch all products (optional category filter)
  getAll: (category = '') =>
    API.get('/products', { params: category ? { category } : {} }),

  // Fetch single product by ID
  getById: (id) => API.get(`/products/${id}`),

  // Create new product
  create: (data) => API.post('/products', data),

  // Update product
  update: (id, data) => API.put(`/products/${id}`, data),

  // Delete product
  remove: (id) => API.delete(`/products/${id}`),
};

export default API;
