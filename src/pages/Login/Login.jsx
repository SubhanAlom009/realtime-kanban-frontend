import "./Login.css";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="login">
      <div className="login__box">
        <h2 className="login__title">Login to CollabBoard</h2>

        <form className="login__form">
          <div className="login__field">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="login__field">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>

          <button type="submit" className="login__btn">
            Login
          </button>
        </form>

        <p className="login__footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
