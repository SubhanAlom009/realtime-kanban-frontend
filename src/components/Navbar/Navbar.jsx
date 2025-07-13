import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          CollabBoard
        </Link>

        <div className="navbar__links">
          {token ? (
            <div className="navbar__user">
              <span className="navbar__greet">Hi, {username}</span>
              <button className="navbar__btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar__btn">
                Login
              </Link>
              <Link to="/register" className="navbar__btn">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
