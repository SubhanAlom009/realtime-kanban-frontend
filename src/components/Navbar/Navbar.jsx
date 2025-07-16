import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

// Import Playfair Display for the logo and Poppins for the rest of the text
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setMenuOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Add backdrop outside the navbar element for proper z-index stacking */}
      {menuOpen && <div className="navbar__backdrop" onClick={closeMenu}></div>}

      <nav className="navbar glass-navbar">
        <div className="navbar__container">
          <Link
            to="/"
            className="navbar__logo gradient-text"
            onClick={closeMenu}
          >
            <span className="cursive-text">Collab</span>Board
          </Link>

          <button
            className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`navbar__links ${menuOpen ? "open" : ""}`}>
            {token && (
              <Link
                to="/board"
                className="navbar__btn glass-btn board-btn"
                onClick={closeMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "6px" }}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                Board
              </Link>
            )}

            {token ? (
              <div className="navbar__user">
                <span className="navbar__greet">Hi, {username}</span>
                <button
                  className="navbar__btn glass-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="navbar__btn glass-btn"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="navbar__btn glow-btn"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
