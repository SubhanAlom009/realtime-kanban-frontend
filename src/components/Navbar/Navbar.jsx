import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const token = localStorage.getItem("token");
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
            <button className="navbar__btn" onClick={handleLogout}>
              Logout
            </button>
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
