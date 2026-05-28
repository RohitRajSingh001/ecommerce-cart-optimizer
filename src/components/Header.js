import React from "react";

function Header({ cartCount, toggleTheme, openCart }) {
  return (
    <header className="header">
      <div className="header-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg
          className="header-logo-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span>Cartify</span>
      </div>

      <div className="header-controls">
        <button
          className="btn-icon"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title="Toggle Light/Dark Theme"
        >
          {/* Custom Sun/Moon SVG Toggle */}
          <svg
            className="theme-toggle-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>

        <button
          className="btn-icon"
          onClick={openCart}
          aria-label="Open shopping cart"
          title="Open Cart"
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}

export default Header;