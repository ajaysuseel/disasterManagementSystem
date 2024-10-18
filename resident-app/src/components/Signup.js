import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/rsignup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Get the JSON data

      if (!response.ok) {
        // If response is not ok, throw an error with the message from the backend
        throw new Error(data.message || 'Signup failed. Please try again.');
      }

      // If signup is successful
      setAlertMessage('Signup successful! Please log in.');
      setAlertType('success');
      setEmail(''); // Clear the input fields
      setPassword('');

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
    <div className="signup-top">
      <div className="signup-container">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSignup}>
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
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        {alertMessage && (
          <div className={`alert ${alertType}`}>
            {alertMessage}
          </div>
        )}
        <div className="login-link">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
