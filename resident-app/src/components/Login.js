import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Login.css'; // Include a CSS file for auth styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/rlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Get the JSON data

      if (!response.ok) {
        // If response is not ok, throw an error with the message from the backend
        throw new Error(data.message || 'Login failed. Please try again.');
      }

      console.log(data); // Handle login success (e.g., redirect, store token)

      // Optionally, you can show a success message
      setAlertMessage('Login successful!');
      setAlertType('success');

      // Automatically hide the alert after 2 seconds
      setTimeout(() => {
        setAlertMessage('');
        setAlertType('');
      }, 2000);
      
    } catch (error) {
      // Set error message from the backend or a generic message
      setAlertMessage(error.message);
      setAlertType('error');

      // Automatically hide the alert after 2 seconds
      setTimeout(() => {
        setAlertMessage('');
        setAlertType('');
      }, 2000);
    }
  };

  return (
    <div className="auth-top">
      <div className="auth-container">
        <h2 className="login-title">Resident Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? 'text' : 'password'} // Change type based on state
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="show-password">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)} // Toggle show password
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        {alertMessage && (
          <div className={`alert ${alertType}`}>
            {alertMessage}
          </div>
        )}
        <div className="signup-link">
          <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
