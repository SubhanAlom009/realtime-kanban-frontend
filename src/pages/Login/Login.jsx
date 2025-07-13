import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      email: email.trim(),
      password: password.trim(),
    };

    if (!userData.email || !userData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(`${API}/api/auth/login`, userData);

      if (response.status === 200) {
        toast.success("✅ Login successful!");
        toast.info("Redirecting to dashboard...");

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.user.username);

        setEmail("");
        setPassword("");

        setTimeout(() => {
          navigate("/board");
        }, 1000);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(`❌ ${msg}`);
      console.error("❌ Login error:", msg);
    }
  };

  return (
    <div className="login">
      <div className="login__box">
        <h2 className="login__title">Login to CollabBoard</h2>

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="login__field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
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
