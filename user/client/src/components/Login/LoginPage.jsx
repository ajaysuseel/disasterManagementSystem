import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState(''); // Renamed to 'username' for clarity
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/login', { // Adjusted URL to your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Send username and password to backend
      });

      if (!response.ok) {
        throw new Error('Invalid email or password'); // Custom error message
      }

      const data = await response.json();
      console.log('Login successful:', data);
      setError(''); // Clear any previous error
      navigate('/home'); // Redirect to home on success
    } catch (error) {
      setError(error.message); // Set error message from the response
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <h1>Local Hazard & Disaster Management System</h1>
        <p>For Panchayat Administration Only</p>
        <p>Panchayat: <strong>Karikode Panchayat</strong></p>
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
              onChange={(e) => setUsername(e.target.value)}
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

export default Login;
