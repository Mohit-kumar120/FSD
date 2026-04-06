// src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import CartDrawer from './components/CartDrawer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  // ── Cart State ──────────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState([]);       // [{...product, qty}]
  const [cartOpen, setCartOpen]   = useState(false);    // drawer open/close

  // Add product — agar already hai to qty++ karo
  const addToCart = (product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        return prev.map(i =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true); // add karte hi drawer kholo
  };

  // Qty change karo
  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  // Remove item
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
  };

  // Clear cart
  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="app-wrapper">
      {/* Navbar — cart count pass karo */}
      <Navbar
        cartCount={totalItems}
        onCartClick={() => setCartOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onClear={clearCart}
        totalPrice={totalPrice}
      />

      {/* Overlay behind drawer */}
      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Hero Banner */}
      <div className="hero-banner bg-primary text-white py-5">
        <div className="container text-center">
          <h1 className="display-5 fw-bold mb-2">Product Catalog</h1>
          <p className="lead opacity-75 mb-0">
            Full-Stack MERN Integration — React ↔ Express ↔ MongoDB via Axios
          </p>
          <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
            {['React 18','Express 4','MongoDB','Axios'].map(t => (
              <span key={t} className="badge bg-white text-primary fs-6 px-3 py-2 rounded-pill">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fw-bold mb-0">
            <i className="bi bi-grid-3x3-gap me-2 text-primary"></i>
            All Products
          </h2>
          <span className="text-muted small">
            <i className="bi bi-database me-1"></i>
            Source: MongoDB Atlas
          </span>
        </div>

        {/* addToCart function ProductList ko do, woh ProductCard ko pass karega */}
        <ProductList onAddToCart={addToCart} />
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-1 fw-semibold">Experiment 2.3.1 — Full Stack Integration (MERN)</p>
          <p className="text-white-50 small mb-0">
            CO3 · CO4 · CO5 &nbsp;|&nbsp; React-Express Integration with Axios
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
