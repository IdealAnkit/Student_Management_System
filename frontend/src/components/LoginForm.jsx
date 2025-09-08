import React, { useState } from 'react';
export default function LoginForm({ onLogin, loading, error }) {
  const [form, setForm] = useState({ username: '', password: '' });
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    onLogin(form.username, form.password);
  }
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input className="login-input" name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
      <input className="login-input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required />
      <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
} 