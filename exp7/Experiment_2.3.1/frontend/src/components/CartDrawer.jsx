// src/components/CartDrawer.jsx
// Slide-in cart drawer from right side

import React from 'react';

function CartDrawer({ isOpen, onClose, cartItems, onUpdateQty, onRemove, onClear, totalPrice }) {
  return (
    <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}>
      {/* Header */}
      <div className="cart-drawer__header">
        <h5 className="mb-0 fw-bold">
          <i className="bi bi-cart3 me-2"></i>
          Your Cart
          {cartItems.length > 0 && (
            <span className="badge bg-primary rounded-pill ms-2">
              {cartItems.reduce((s, i) => s + i.qty, 0)}
            </span>
          )}
        </h5>
        <button className="btn-close" onClick={onClose} />
      </div>

      {/* Body */}
      <div className="cart-drawer__body">
        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="cart-empty">
            <div className="cart-empty__icon">🛒</div>
            <p className="fw-semibold text-dark mb-1">Cart is empty</p>
            <p className="text-muted small">Products add karo aur yahan dikhenge!</p>
          </div>
        ) : (
          /* Items List */
          <ul className="cart-items-list">
            {cartItems.map(item => (
              <li key={item._id} className="cart-item">
                {/* Icon */}
                <div className="cart-item__icon">
                  {item.category === 'Electronics' ? '🔌' :
                   item.category === 'Sports'      ? '⚡' :
                   item.category === 'Kitchen'     ? '☕' :
                   item.category === 'Home'        ? '🏠' : '📦'}
                </div>

                {/* Info */}
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.name}</p>
                  <p className="cart-item__price">${(item.price * item.qty).toFixed(2)}</p>
                </div>

                {/* Qty Controls */}
                <div className="cart-item__controls">
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQty(item._id, item.qty - 1)}
                  >−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQty(item._id, item.qty + 1)}
                  >+</button>
                </div>

                {/* Remove */}
                <button
                  className="cart-item__remove"
                  onClick={() => onRemove(item._id)}
                  title="Remove"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer — only when items exist */}
      {cartItems.length > 0 && (
        <div className="cart-drawer__footer">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-semibold text-dark">Total</span>
            <span className="fs-5 fw-bold text-success">${totalPrice.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary w-100 mb-2">
            <i className="bi bi-bag-check me-2"></i>Checkout
          </button>
          <button
            className="btn btn-outline-danger btn-sm w-100"
            onClick={onClear}
          >
            <i className="bi bi-trash me-1"></i>Clear Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default CartDrawer;
