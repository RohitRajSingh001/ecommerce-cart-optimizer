import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import products from "./data/products";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [budget, setBudget] = useState("");
  const [optimized, setOptimized] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Custom Toast System State
  const [toasts, setToasts] = useState([]);
  
  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [receipt, setReceipt] = useState(null);

  // Auto-dark mode sync with system preferences on first load
  useEffect(() => {
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isSystemDark);
  }, []);

  // Toast trigger helper
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Cart operations
  const addToCart = (product, qty) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
    }
    addToast(`Added ${qty}x ${product.name} to cart.`, "success");
  };

  const removeItem = (id) => {
    const removedItem = cartItems.find((item) => item.id === id);
    setCartItems(cartItems.filter((item) => item.id !== id));
    if (removedItem) {
      addToast(`Removed ${removedItem.name} from cart.`, "info");
    }
  };

  const updateQty = (id, newQty) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

  // Advanced Greedy Optimizer
  const optimizeCart = async () => {
    const remainingBudget = parseInt(budget);
    if (isNaN(remainingBudget) || remainingBudget <= 0) {
      addToast("Please enter a valid target budget first.", "warning");
      return;
    }

    if (cartItems.length === 0) {
      addToast("Your cart is empty. Add items first!", "warning");
      return;
    }

    try {
      // 1. Call Node.js Express server to perform 0/1 Knapsack DP Optimization
      const response = await axios.post("http://localhost:5000/api/optimize", {
        cartItems,
        budget
      });
      
      setOptimized(response.data.optimizedItems);
      addToast("0/1 Knapsack DP complete! (Backend Server)", "success");
    } catch (error) {
      console.warn("[Backend Offline] Falling back to client-side 0/1 Knapsack DP solver.", error);
      
      // 2. CLIENT-SIDE FALLBACK SOLVER (0/1 Knapsack DP)
      // Guarantees absolute correctness and functionality even if backend server is offline!
      const flatItems = [];
      cartItems.forEach((item) => {
        const qty = parseInt(item.qty) || 1;
        const discountPercent = parseInt(item.discount) || 0;
        
        const unitOriginalPrice = Math.round(item.price);
        const unitDiscountedPrice = Math.round(unitOriginalPrice - (unitOriginalPrice * discountPercent) / 100);
        const unitSavings = Math.round((unitOriginalPrice * discountPercent) / 100);

        for (let i = 0; i < qty; i++) {
          flatItems.push({
            ...item,
            weight: unitDiscountedPrice,  // Cost to buy (Weight)
            value: unitSavings            // Discount saved (Value)
          });
        }
      });

      const N = flatItems.length;
      const W = remainingBudget;
      const dp = Array(N + 1).fill(null).map(() => Array(W + 1).fill(0));

      // Solve the DP Matrix
      for (let i = 1; i <= N; i++) {
        const item = flatItems[i - 1];
        for (let w = 0; w <= W; w++) {
          if (item.weight <= w) {
            dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - item.weight] + item.value);
          } else {
            dp[i][w] = dp[i - 1][w];
          }
        }
      }

      // Backtrack
      let w = W;
      const selectedFlat = [];
      for (let i = N; i > 0; i--) {
        const item = flatItems[i - 1];
        if (dp[i][w] !== dp[i - 1][w]) {
          selectedFlat.push(item);
          w -= item.weight;
        }
      }

      // Group units back by ID
      const groupedSelected = [];
      selectedFlat.forEach((flatItem) => {
        const existing = groupedSelected.find((item) => item.id === flatItem.id);
        if (existing) {
          existing.qty += 1;
          existing.finalPrice += flatItem.weight;
        } else {
          groupedSelected.push({
            ...flatItem,
            qty: 1,
            finalPrice: flatItem.weight
          });
        }
      });

      setOptimized(groupedSelected);
      addToast("0/1 Knapsack DP complete! (Local Failover)", "info");
    }
  };

  // Replaces current active cart with the optimized items selection
  const applyOptimization = () => {
    if (optimized.length === 0) return;
    setCartItems(optimized);
    setOptimized([]);
    addToast("Applied optimized recommendation to your cart!", "success");
  };

  // Simulated checkout handler
  const handleCheckout = (checkoutItems, sourceName) => {
    const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const savings = checkoutItems.reduce((sum, item) => {
      const discountPercent = parseInt(item.discount) || 0;
      return sum + (item.price * item.qty * discountPercent) / 100;
    }, 0);
    const total = subtotal - savings;

    setReceipt({
      items: checkoutItems,
      subtotal,
      savings,
      total,
      source: sourceName,
    });
    setShowCheckoutModal(true);
    // Clear cart upon successful simulated purchase
    setCartItems([]);
    setOptimized([]);
    addToast("Purchase completed successfully!", "success");
  };

  // Filtering products based on query and category selection
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate current active cart values
  const currentCartTotal = cartItems.reduce((sum, item) => {
    const discountPercent = parseInt(item.discount) || 0;
    const finalPrice = item.price * item.qty - (item.price * item.qty * discountPercent) / 100;
    return sum + finalPrice;
  }, 0);

  const budgetNum = parseInt(budget) || 0;
  const budgetUtilizationPercent = budgetNum > 0 ? Math.min(100, (currentCartTotal / budgetNum) * 100) : 0;

  // Visual warning colors for budget bar
  let budgetGaugeClass = "";
  if (budgetUtilizationPercent > 100 || currentCartTotal > budgetNum) {
    budgetGaugeClass = "danger";
  } else if (budgetUtilizationPercent > 80) {
    budgetGaugeClass = "warning";
  }

  return (
    <div className={darkMode ? "dark" : "light"}>
      <Header
        cartCount={cartItems.length}
        toggleTheme={() => setDarkMode(!darkMode)}
        openCart={() => setShowCart(true)}
      />

      {/* FILTER AND SEARCH CONTROLS */}
      <div className="controls-bar">
        <div className="search-box">
          <svg
            className="search-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search premium products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {["All", "Electronics", "Footwear", "Accessories"].map((cat) => (
            <button
              key={cat}
              className={`btn-filter ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="main-content">
        {/* PRODUCT GRID SECTION */}
        <section className="store-section">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Explore Catalog ({filteredProducts.length})
          </h2>
          
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              <p>No products found matching your search.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* BUDGET & OPTIMIZER PANEL */}
        <section className="optimizer-section">
          <div className="optimizer-card">
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
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Smart Budget Optimizer
            </h2>

            <div className="budget-input-wrapper">
              <label className="budget-input-label" htmlFor="budget-field">
                <span>Set Maximum Budget Target</span>
                {budgetNum > 0 && <span>Goal: ₹{budgetNum}</span>}
              </label>
              <div className="budget-field">
                <span className="currency-symbol">₹</span>
                <input
                  id="budget-field"
                  type="number"
                  placeholder="Enter target budget (e.g. 5000)"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                <button className="btn-optimize" onClick={optimizeCart}>
                  Optimize
                </button>
              </div>
            </div>

            {/* DYNAMIC PROGRESS GAUGE */}
            {budgetNum > 0 && (
              <div className="budget-visualizer">
                <div className="gauge-header">
                  <span>Budget Tracker</span>
                  <span style={{ fontWeight: 700 }}>
                    {Math.round(budgetUtilizationPercent)}% Utilized
                  </span>
                </div>
                <div className="gauge-bg">
                  <div
                    className={`gauge-fill ${budgetGaugeClass}`}
                    style={{ width: `${Math.min(100, budgetUtilizationPercent)}%` }}
                  />
                </div>
                <div className="gauge-metrics">
                  <div className="metric-item">
                    <span className="metric-label">Cart Total</span>
                    <span className={`metric-value ${currentCartTotal > budgetNum ? "exceeded" : ""}`}>
                      ₹{Math.round(currentCartTotal)}
                    </span>
                  </div>
                  <div className="metric-item" style={{ alignItems: "flex-end" }}>
                    <span className="metric-label">Remaining</span>
                    <span className="metric-value">
                      ₹{Math.max(0, budgetNum - Math.round(currentCartTotal))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* OPTIMIZED CART SECTION */}
            {optimized.length > 0 ? (
              <div className="optimizedBox">
                <div className="optimizedBox-header">
                  <h3>
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ width: "18px", height: "18px", color: "#10b981" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Optimized Recommendation
                  </h3>
                  <span className="savings-tag">
                    Fits Budget: ₹{Math.round(optimized.reduce((sum, item) => sum + item.finalPrice, 0))}
                  </span>
                </div>

                <div className="optimized-list">
                  {optimized.map((item) => (
                    <div className="optimized-item" key={item.id}>
                      <img src={item.image} alt={item.name} className="opt-item-img" />
                      
                      <div className="opt-item-info">
                        <h4>{item.name}</h4>
                        <span className="opt-item-qty">Quantity: {item.qty}</span>
                      </div>

                      <div className="opt-item-price">
                        <div className="opt-item-final-price">₹{Math.round(item.finalPrice)}</div>
                        <div className="opt-item-original-price">₹{item.price * item.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="opt-footer-actions">
                  <button className="btn-secondary" onClick={applyOptimization}>
                    Apply to Active Cart
                  </button>
                  <button 
                    className="btn-checkout" 
                    onClick={() => handleCheckout(optimized, "Optimized Cart Selection")}
                  >
                    Purchase Optimized Cart
                  </button>
                </div>
              </div>
            ) : (
              budgetNum > 0 && cartItems.length > 0 && currentCartTotal > budgetNum && (
                <div style={{
                  padding: "16px",
                  borderRadius: "12px",
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  display: "flex",
                  gap: "8px",
                  alignItems: "center"
                }}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: "20px", height:"20px"}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  <span>Cart total exceeds budget! Click "Optimize" to fit it dynamically.</span>
                </div>
              )
            )}
          </div>
        </section>
      </main>

      {/* FLYOUT CART DRAWER */}
      {showCart && (
        <Cart
          cartItems={cartItems}
          closeCart={() => setShowCart(false)}
          removeItem={removeItem}
          updateQty={updateQty}
        />
      )}

      {/* TOAST ALERTS overlays */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div className={`toast ${toast.type}`} key={toast.id}>
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {toast.type === "success" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : toast.type === "warning" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* CHECKOUT RECEIPT MODAL */}
      {showCheckoutModal && receipt && (
        <div className="modal-overlay">
          <div className="checkout-modal">
            <div className="success-animation">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2>Order Placed!</h2>
            <p>Your simulated transaction via {receipt.source} was completed.</p>
            
            <div className="receipt-box">
              <h4 style={{ marginBottom: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
                Receipt Summary
              </h4>
              <div style={{ maxHeight: "150px", overflowY: "auto", marginBottom: "12px" }}>
                {receipt.items.map((item) => (
                  <div key={item.id} className="receipt-row" style={{ fontSize: "0.85rem" }}>
                    <span>{item.qty}x {item.name}</span>
                    <span>₹{Math.round((item.price * item.qty) - (item.price * item.qty * parseInt(item.discount) / 100))}</span>
                  </div>
                ))}
              </div>
              <div className="receipt-row">
                <span>Original Subtotal</span>
                <span>₹{receipt.subtotal}</span>
              </div>
              <div className="receipt-row" style={{ color: "#10b981", fontWeight: 600 }}>
                <span>Saved from Deals</span>
                <span>-₹{Math.round(receipt.savings)}</span>
              </div>
              <div className="receipt-row total">
                <span>Total Amount Paid</span>
                <span>₹{Math.round(receipt.total)}</span>
              </div>
              
              <div className="receipt-savings">
                🎉 Awesome! You saved a total of ₹{Math.round(receipt.savings)} on this purchase!
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: "100%", padding: "14px" }}
              onClick={() => setShowCheckoutModal(false)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
