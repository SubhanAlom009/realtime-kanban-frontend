import "./Register.css";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="register">
      <div className="register__box">
        <h2 className="register__title">Create an Account</h2>

        <form className="register__form">
          <div className="register__field">
            <label>Username</label>
            <input type="text" placeholder="Enter your name" />
          </div>

          <div className="register__field">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>

          <div className="register__field">
            <label>Password</label>
            <input type="password" placeholder="Create a password" />
          </div>

          <button type="submit" className="register__btn">
            Register
          </button>
        </form>

        <p className="register__footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
