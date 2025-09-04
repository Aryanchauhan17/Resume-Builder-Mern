import React, { useState } from "react";
import { loginUser } from "../api/api"; // make sure this exists
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // import the CSS file

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // handle form input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form); // call API
      localStorage.setItem("token", res.data.token); // save token
      setSuccess("Login successful!");
      setError("");
      navigate("/dashboard"); // redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
      setSuccess("");
    }
  };

 return (
  <div className="login-page">  {/* Full-page wrapper for centering */}
    <div className="login-container">
      <h2>Login</h2>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn login-btn">
          Login
        </button>
      </form>

      <div className="login-links">
        <span>Don't have an account?</span>
        <a href="/register">Sign up</a>
      </div>
    </div>
  </div>
);

};

export default Login;
