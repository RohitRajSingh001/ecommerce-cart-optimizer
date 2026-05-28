import React, { useState } from "react";

function ProductCard({ product, addToCart }) {
  const [qty, setQty] = useState(1);

  const discountPercent = parseInt(product.discount) || 0;
  const discountedPrice = Math.round(product.price - (product.price * discountPercent) / 100);

  const handleIncrement = () => setQty((prev) => prev + 1);
  const handleDecrement = () => setQty((prev) => Math.max(1, prev - 1));

  const handleAdd = () => {
    addToCart(product, qty);
    // Reset quantity selection on card back to 1 after adding to cart
    setQty(1);
  };

  return (
    <div className="product-card">
      <div className="product-img-wrapper">
        <img src={product.image} alt={product.name} loading="lazy" />
        {discountPercent > 0 && (
          <span className="discount-badge">{product.discount}</span>
        )}
        {product.category && (
          <span className="category-tag">{product.category}</span>
        )}
      </div>

      <div className="product-info">
        {product.rating && (
          <div className="product-rating">
            <svg
              className="rating-star"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="rating-value">{product.rating}</span>
            <span className="rating-reviews">({product.reviews || 0} reviews)</span>
          </div>
        )}

        <h3>{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-price-row">
          <span className="current-price">₹{discountedPrice}</span>
          {discountPercent > 0 && (
            <span className="original-price">₹{product.price}</span>
          )}
        </div>

        <div className="card-footer">
          <div className="qty-selector">
            <button onClick={handleDecrement} type="button" aria-label="Decrease quantity">
              -
            </button>
            <span>{qty}</span>
            <button onClick={handleIncrement} type="button" aria-label="Increase quantity">
              +
            </button>
          </div>

          <button className="btn-primary" onClick={handleAdd} type="button">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "16px", height: "16px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;