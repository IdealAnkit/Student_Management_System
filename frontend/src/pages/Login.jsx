import React, { useState } from "react";
import { login } from "../api";
import LoginForm from "../components/LoginForm";
import "./Login.css";

export default function Login({ onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme((prev) => (prev === "neon" ? "light" : "neon"));
  }

  async function handleLogin(username, password) {
    setLoading(true);
    setError("");
    const res = await login(username, password);
    if (res.success) {
      onLoginSuccess();
    } else {
      setError(res.message || "Login failed");
    }
    setLoading(false);
  }
  return (
    <div className={`login-page-container ${theme}`}>
      <button className="theme-switcher" onClick={toggleTheme}>
        Switch to {theme === "neon" ? "Light" : "Neon"} Theme
      </button>
      <h1 className="login-title">Admin Login</h1>
      <LoginForm onLogin={handleLogin} loading={loading} error={error} />
    </div>
  );
}
