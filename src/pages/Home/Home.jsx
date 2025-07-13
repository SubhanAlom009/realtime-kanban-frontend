import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Welcome to CollabBoard</h1>
          <p className="hero__subtitle">
            A real-time Kanban board to help your team collaborate better,
            faster, cleaner.
          </p>

          <div className="hero__actions">
            <Link to="/login" className="hero__btn">
              Login
            </Link>
            <Link to="/register" className="hero__btn secondary">
              Register
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
