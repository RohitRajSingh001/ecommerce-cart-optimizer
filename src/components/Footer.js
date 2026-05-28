import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Cartify</h3>
          <p>
            Maximize your purchasing power. Cartify helps you pick the optimal selection of products to fit perfectly within your budget. Shop smart, save more.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Shop</h4>
          <ul>
            <li><a href="#electronics">Electronics</a></li>
            <li><a href="#footwear">Footwear</a></li>
            <li><a href="#accessories">Accessories</a></li>
            <li><a href="#new-arrivals">New Arrivals</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul>
            <li><a href="#faq">FAQs & Guides</a></li>
            <li><a href="#shipping">Shipping & Returns</a></li>
            <li><a href="#support">24/7 Live Chat Support</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Join the Club</h4>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px", lineHeight: "1.5" }}>
            Subscribe to receive alerts about major promotional discounts!
          </p>
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              type="email"
              placeholder="Your email address"
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-app)",
                color: "var(--text-main)",
                fontSize: "0.8rem",
                width: "100%",
                outline: "none"
              }}
            />
            <button
              style={{
                background: "var(--primary-gradient)",
                border: "none",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "700",
                cursor: "pointer"
              }}
              onClick={() => alert("Thank you for subscribing to Cartify!")}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Cartify Inc. All rights reserved. Made for optimal shopping.</p>
        <div className="payment-badges">
          <span className="payment-badge">UPI</span>
          <span className="payment-badge">Visa</span>
          <span className="payment-badge">Mastercard</span>
          <span className="payment-badge">Rupay</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;