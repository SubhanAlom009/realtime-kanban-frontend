import "./Home.css";
import { Link } from "react-router-dom";

// Import the same fonts used in Navbar for consistency
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">
            Welcome to <span className="accent-text">CollabBoard</span>
          </h1>
          <p className="hero__subtitle">
            A real-time Kanban board to help your team collaborate better,
            faster, cleaner.
          </p>

          <div className="hero__actions">
            <Link to="/register" className="hero__btn primary">
              Get Started
            </Link>
            <Link to="/login" className="hero__btn secondary">
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
