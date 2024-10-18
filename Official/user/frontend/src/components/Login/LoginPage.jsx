// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext'; // Import the useUser hook
import './Login.css';

const LoginPage = () => {
  const { setUsername } = useUser(); // Get setUsername from context
  const [username, setUsernameLocal] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password'); 
      }

      const data = await response.json();
      console.log('Login successful:', data);
      setError('');

      setUsernameLocal(username); // Save to local state
      setUsername(username); // Save to context

      localStorage.setItem('username', username); 

      navigate('/home'); 
    } catch (error) {
      setError(error.message); 
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <h1>Local Hazard & Disaster Management System</h1>
        <p>For Panchayat Administration Only</p>
        <p>Panchayat: <strong>Kottamkara Grama Panchayat</strong></p>
        <p>Administrator: <strong>Panchayat Officer</strong></p>
      </header>

      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsernameLocal(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />{' '}
              Show Password
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>

      <footer className="login-footer">
        <p>&copy; All rights reserved by LHDMS</p>
      </footer>
    </div>
  );
};

export default LoginPage;
