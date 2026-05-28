import React from "react";

function Cart({ cartItems, closeCart, removeItem, updateQty }) {
  // Calculate pricing summaries
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  
  const totalSavings = cartItems.reduce((sum, item) => {
    const discountPercent = parseInt(item.discount) || 0;
    const itemSavings = (item.price * item.qty * discountPercent) / 100;
    return sum + itemSavings;
  }, 0);

  const finalTotal = subtotal - totalSavings;

  return (
    <>
      {/* Background blur overlay to close cart on click */}
      <div className="cart-overlay" onClick={closeCart} />

      <div className="cartPanel">
        <div className="cart-header">
          <h2>
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "24px", height: "24px", color: "#6366f1" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            My Cart ({cartItems.length})
          </h2>
          <button className="btn-close" onClick={closeCart} aria-label="Close cart">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="empty-cart-state">
              <svg
                className="empty-cart-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p>Your cart is looking empty.</p>
              <p style={{ fontSize: "0.85rem", marginTop: "-8px" }}>
                Add items from the store to optimize your budget!
              </p>
            </div>
          ) : (
            cartItems.map((item, index) => {
              const discountPercent = parseInt(item.discount) || 0;
              const discountedPrice = Math.round(item.price - (item.price * discountPercent) / 100);

              return (
                <div className="cart-item" key={item.id || index}>
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <div className="cart-item-meta">
                      {discountPercent > 0 && (
                        <span className="cart-item-discount">{item.discount}</span>
                      )}
                    </div>

                    <div className="cart-actions">
                      <div className="qty-selector">
                        <button
                          onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                          type="button"
                        >
                          -
                        </button>
                        <span>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn-remove"
                        onClick={() => removeItem(item.id)}
                        type="button"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-price-col" style={{ textAlign: "right" }}>
                    <span className="cart-item-price">₹{discountedPrice * item.qty}</span>
                    {discountPercent > 0 && (
                      <div className="cart-item-original">₹{item.price * item.qty}</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row savings">
              <span>Discounts Saved</span>
              <span>-₹{Math.round(totalSavings)}</span>
            </div>
            <div className="summary-row total">
              <span>Final Total</span>
              <span>₹{Math.round(finalTotal)}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;