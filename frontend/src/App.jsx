import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { checkSession } from './api';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkSession().then(res => setLoggedIn(res.loggedIn));
  }, []);

  return loggedIn ? <Dashboard /> : <Login onLoginSuccess={() => setLoggedIn(true)} />;
} 