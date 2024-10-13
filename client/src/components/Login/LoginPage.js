import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {auth} from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleLogin =async (e) => {
    e.preventDefault();
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError(''); // Clear any previous error
      navigate('/home'); // Redirect to home on success
    } catch (error) {
      setError('Invalid email or password'); // Set error message
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
            <label>Email:</label>
            <input
              type="email"
              value={email}
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
        <p>&copy; All rights reserved by Kerala State Government</p>
      </footer>
    </div>
  );
};

export default Login;
