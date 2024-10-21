import React, { useState } from 'react';
import './Signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const initialFormData = {
    email: '',
    password: '',
    name: '',
    username: 'Guest', // Default username
    age: '',
    phone_number: '',
    ward: 'ward1',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setAlertMessage(''); // Clear alert on reset
    setAlertType('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/rsignup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          age: formData.age,
          phone_number: formData.phone_number,
          ward: formData.ward,
        }),
      });

      const data = await response.json(); // Get the JSON data

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed. Please try again.');
      }

      // If signup is successful
      setAlertMessage('Signup successful! Please log in.');
      setAlertType('success');
      handleReset(); // Reset the form

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
        {alertMessage && (
          <div className={`alert ${alertType}`}>
            {alertMessage}
          </div>
        )}
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'} // Toggle input type based on state
                id="password"
                className="input-field"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              className="input-field"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="age">Age</label>
            <input
              className="input-field"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              className="input-field"
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="ward">Ward</label>
            <select
              className="input-field"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
            >
              {Array.from({ length: 21 }, (_, index) => (
                <option key={index} value={`ward${index + 1}`}>Ward {index + 1}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="signup-button">Sign Up</button>
          <button type="button" className="signup-button" onClick={handleReset}>Reset</button>
        </form>
        <div className="login-link">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
