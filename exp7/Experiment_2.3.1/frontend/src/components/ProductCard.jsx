// src/components/ProductCard.jsx
// Displays individual product information

import React from 'react';

const categoryIcons = {
  Electronics: '🔌',
  Sports: '⚡',
  Kitchen: '☕',
  Home: '🏠',
  Fashion: '👗',
  Books: '📚',
};

const categoryColors = {
  Electronics: 'primary',
  Sports: 'success',
  Kitchen: 'warning',
  Home: 'info',
  Fashion: 'danger',
  Books: 'secondary',
};

function StarRating({ rating }) {
  return (
    <span className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ color: star <= Math.round(rating) ? '#f59e0b' : '#d1d5db', fontSize: '0.9rem' }}
        >
          ★
        </span>
      ))}
      <small className="text-muted ms-1">({rating.toFixed(1)})</small>
    </span>
  );
}

function ProductCard({ product, onAddToCart }) {
  const { name, description, price, category, stock, rating } = product;
  const icon = categoryIcons[category] || '📦';
  const badgeColor = categoryColors[category] || 'secondary';

  return (
    <div className="col-sm-6 col-lg-4 mb-4">
      <div className="card product-card h-100 shadow-sm border-0">
        {/* Card Header with Category Icon */}
        <div className={`card-img-top product-icon-header bg-${badgeColor} bg-opacity-10`}>
          <span className="display-4">{icon}</span>
        </div>

        <div className="card-body d-flex flex-column">
          {/* Category Badge */}
          <div className="mb-2">
            <span className={`badge bg-${badgeColor} bg-opacity-75 rounded-pill`}>
              {category}
            </span>
            {stock < 10 && (
              <span className="badge bg-danger bg-opacity-75 rounded-pill ms-1">
                Low Stock
              </span>
            )}
          </div>

          {/* Product Name */}
          <h5 className="card-title fw-bold text-dark mb-1">{name}</h5>

          {/* Star Rating */}
          <StarRating rating={rating} />

          {/* Description */}
          <p className="card-text text-muted small mt-2 flex-grow-1">{description}</p>

          {/* Price & Stock Row */}
          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
            <span className="fs-5 fw-bold text-success">${price.toFixed(2)}</span>
            <small className="text-muted">
              <i className="bi bi-box-seam me-1"></i>
              {stock} in stock
            </small>
          </div>

          {/* Action Button */}
          <button
            className={`btn btn-${badgeColor} btn-sm mt-3 w-100`}
            onClick={() => onAddToCart(product)}
          >
            <i className="bi bi-cart-plus me-1"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
