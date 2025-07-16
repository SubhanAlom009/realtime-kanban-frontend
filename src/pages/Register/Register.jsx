import React, { useEffect } from "react";
import { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Import the same fonts used in Navbar for consistency
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/board"); // Redirect if already logged in
    }
  }, [token, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    };

    // Frontend check
    if (!userData.username || !userData.email || !userData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(`${API}/api/auth/register`, userData);

      if (response.status === 201) {
        // Show toast first
        toast.success("🎉 Registration successful!");
        toast.info("Redirecting to dashboard...");

        // Save token
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.newUser.username);

        // Reset form fields
        setUsername("");
        setEmail("");
        setPassword("");

        // Delay redirect to let user see toast
        setTimeout(() => {
          navigate("/board");
        }, 1000);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(`❌ ${msg}`);
      console.error("❌ Registration error:", msg);
    }
  };

  return (
    <div className="register">
      <div className="register__box">
        <h2 className="register__title">
          Join <span className="accent-text">CollabBoard</span>
        </h2>

        <form className="register__form" onSubmit={handleSubmit}>
          <div className="register__field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="register__field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="register__field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
            />
          </div>

          <button type="submit" className="register__btn">
            Create Account
          </button>
        </form>

        <p className="register__footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
