// src/components/Navbar.jsx

import React from 'react';

function Navbar({ cartCount = 0, onCartClick }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        {/* Brand */}
        <a className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4" href="/">
          <span>🛒</span>
          <span>ShopMERN</span>
        </a>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <li className="nav-item">
              <a className="nav-link active" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/">Products</a>
            </li>
            <li className="nav-item ms-lg-2">
              {/* Cart button — live count */}
              <button
                className="btn btn-outline-light btn-sm position-relative"
                onClick={onCartClick}
              >
                <i className="bi bi-cart3 me-1"></i>Cart
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
